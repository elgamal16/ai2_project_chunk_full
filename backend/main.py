import csv, io, json, os
from typing import Literal, Optional
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, Field
from . import db, notify
from ai.core import ml
from ai.core.schema import FEATURES

MAX_BYTES = 15 * 1024 * 1024
app = FastAPI(title="Churn Radar API", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])
db.init()

@app.get("/api/health")
def health(): return {"status": "ok", "notify_mode": notify.provider().mode, "model": ml.METRICS}

@app.get("/api/model")
def model_info(): return ml.METRICS

@app.get("/api/offers")
def offers(): return list(ml.OFFERS.values())

@app.get("/api/sample")
def sample():
    return FileResponse(os.path.join(os.path.dirname(__file__), "..", "data", "sample_upload.csv"), filename="sample_customers.csv", media_type="text/csv")

async def _read(file: UploadFile):
    raw = await file.read()
    if len(raw) > MAX_BYTES: raise HTTPException(413, "File is larger than 15 MB.")
    try: return ml.read_upload(file.filename or "", raw)
    except ValueError as e: raise HTTPException(400, str(e))

@app.post("/api/validate")
async def validate(file: UploadFile = File(...)):
    df = await _read(file); return ml.check_file(df)

def _auto_notify(aid: str, rows: list[dict]) -> dict:
    """بعد التحليل مباشرةً: ابعت للـ will_leave اللي عندهم contact العرض المناسب."""
    prov = notify.provider()
    cid = db.new_id()
    sent = failed = skipped = 0
    by: dict[str, int] = {}
    lang = "ar"

    with db._lock, db.conn() as c:
        for r in rows:
            if r["prediction"] != "will_leave":
                continue

            # اختيار القناة المناسبة بناءً على المتاح والمُفعّل
            ch = None
            if prov.mode == "live":
                pref = os.environ.get("AUTO_NOTIFY_CHANNEL", "smart")
                if pref == "whatsapp" and prov.can_whatsapp and r.get("phone"):
                    ch = "whatsapp"
                elif pref == "sms" and prov.can_sms and r.get("phone"):
                    ch = "sms"
                elif pref == "email" and prov.can_email and r.get("email"):
                    ch = "email"
                else:
                    if prov.can_whatsapp and r.get("phone"):
                        ch = "whatsapp"
                    elif prov.can_sms and r.get("phone"):
                        ch = "sms"
                    elif prov.can_email and r.get("email"):
                        ch = "email"
                    else:
                        ch = "sms" if r.get("phone") else "email" if r.get("email") else None
            else:
                ch = "sms" if r.get("phone") else "email" if r.get("email") else None

            addr = r.get("phone", "") if ch in ("sms", "whatsapp") else r.get("email", "") if ch == "email" else ""
            if not ch or not addr:
                skipped += 1
                continue

            # تحقق من opt-out
            if _supp(addr):
                skipped += 1
                continue

            cust_name = (r.get("name") or "").strip()
            name_display = f"أستاذ {cust_name}" if cust_name else "عميلنا العزيز"
            oid = r.get("suggested_offer") or "general"
            offer_obj = ml.OFFERS.get(oid, ml.OFFERS["general"])
            offer_title = offer_obj.get("title_ar") or offer_obj.get("title", "")

            mail_subject = f"عرض خاص لك يا {cust_name} 🎁" if cust_name else "عرض خاص ومميز لك من شركتنا 🎁"

            body = (
                f"مرحباً {name_display}،\n\n"
                f"يسعدنا وجودك معنا ونقدر ثقتك دائماً.\n"
                f"تقديراً لولائك، يسرنا أن نقدم لك عرضاً حصرياً مصمماً خصيصاً لك:\n\n"
                f"✨ {offer_title} ✨\n\n"
                f"يمكنك الاستفادة من هذا العرض فوراً من خلال تطبيقنا أو بالتواصل معنا.\n\n"
                f"مع أطيب تحياتنا،\n"
                f"فريق خدمة العملاء\n\n"
                f"------------------------------------\n"
                f"لإلغاء الاشتراك أرسل STOP"
            )

            if ch == "email":
                res = prov.email(addr, mail_subject, body)
            elif ch == "whatsapp":
                res = prov.whatsapp(addr, body)
            else:
                res = prov.sms(addr, body)

            ok, detail = res
            sent += 1 if ok else 0
            failed += 0 if ok else 1
            by[ch] = by.get(ch, 0) + 1
            c.execute("INSERT INTO messages VALUES(?,?,?,?,?,?,?)",
                      (cid, r["customer_id"], ch, addr, "sent" if ok else "failed", detail, body))
        summary = {"recipients": sent + failed, "sent": sent, "failed": failed, "skipped": skipped, "by_channel": by}
        c.execute("INSERT INTO campaigns VALUES(?,?,?,?,?,?,?,?)",
                  (cid, db.now(), aid, "per_customer", "smart", lang, prov.mode, json.dumps(summary)))
    return {"auto_campaign_id": cid, "mode": prov.mode, **summary}

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    df = await _read(file); chk = ml.check_file(df)
    if chk["missing_columns"]:
        raise HTTPException(422, {"message": "Required columns are missing.", "missing_columns": chk["missing_columns"]})
    rows = ml.analyze(df, chk)
    if not rows: raise HTTPException(422, {"message": "No valid rows to analyse.", "problems": chk["problems"][:50]})
    summary = ml.summarize(rows); summary["skipped_rows"] = chk.get("blocking_rows", 0)
    aid = db.save_analysis(file.filename, summary, chk, rows)
    # ← إرسال تلقائي لكل العملاء المتوقع مغادرتهم
    auto = _auto_notify(aid, rows)
    return {"analysis_id": aid, "summary": summary, "contacts": chk["contacts"],
            "problem_count": len(chk["problems"]), "problems": chk["problems"][:200],
            "auto_notification": auto}

def _get(aid):
    with db.conn() as c:
        a = c.execute("SELECT * FROM analyses WHERE id=?", (aid,)).fetchone()
    if not a: raise HTTPException(404, "Analysis not found.")
    return a

@app.get("/api/analyses/{aid}")
def get_analysis(aid: str):
    a = _get(aid); return {"id": a["id"], "created": a["created"], "filename": a["filename"], "summary": json.loads(a["summary"])}

def _query(aid, risk, prediction, contract, contact, q):
    sql, args = "SELECT data FROM customers WHERE analysis_id=?", [aid]
    if risk: sql += " AND risk_level=?"; args.append(risk)
    if prediction: sql += " AND prediction=?"; args.append(prediction)
    if contract: sql += " AND contract=?"; args.append(contract)
    if q: sql += " AND customer_id LIKE ?"; args.append(f"%{q}%")
    sql += " ORDER BY risk_score DESC, customer_id"
    with db.conn() as c: rows = [json.loads(r["data"]) for r in c.execute(sql, args)]
    if contact:
        f = {"phone": lambda r: r["phone"] and not r["email"], "email": lambda r: r["email"] and not r["phone"],
             "both": lambda r: r["phone"] and r["email"], "none": lambda r: not r["phone"] and not r["email"]}[contact]
        rows = [r for r in rows if f(r)]
    return rows

@app.get("/api/analyses/{aid}/customers")
def customers(aid: str, risk: Optional[Literal["low", "medium", "high"]] = None, prediction: Optional[Literal["will_leave", "will_stay"]] = None,
              contract: Optional[str] = None, contact: Optional[Literal["phone", "email", "both", "none"]] = None, q: Optional[str] = None,
              page: int = Query(1, ge=1), page_size: int = Query(50, ge=1, le=500)):
    _get(aid); rows = _query(aid, risk, prediction, contract, contact, q); s = (page - 1) * page_size
    return {"total": len(rows), "page": page, "page_size": page_size, "items": rows[s:s + page_size]}

@app.get("/api/analyses/{aid}/export.csv")
def export(aid: str, prediction: Optional[Literal["will_leave", "will_stay"]] = None):
    _get(aid); rows = _query(aid, None, prediction, None, None, None)
    buf = io.StringIO(); w = csv.writer(buf)
    w.writerow(["customer_id", "prediction", "risk_score", "risk_level", "main_reason", "suggested_offer", "phone", "email"])
    for r in rows: w.writerow([r["customer_id"], r["prediction"], r["risk_score"], r["risk_level"], r["main_reason"], r["suggested_offer"] or "", r["phone"], r["email"]])
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv", headers={"Content-Disposition": f'attachment; filename="churn_results_{aid}.csv"'})

class CampaignIn(BaseModel):
    analysis_id: str
    audience: Literal["high_risk", "selected"] = "high_risk"
    customer_ids: list[str] = []
    channel: Literal["sms", "whatsapp", "email", "smart"] = "smart"
    offer_id: Optional[str] = Field(None, description="Fixed offer for everyone. Omit to use each customer's suggested offer.")
    lang: Literal["en", "ar"] = "ar"
    subject: str = "عرض خاص لك من شركتنا 🎁"
    message: str = Field("مرحباً {name}، يسعدنا وجودك معنا. نقدم لك هذا العرض الحصري: {offer}.", max_length=1000)
    consent: bool = False

class Unsub(BaseModel):
    address: str

def _supp(addr):
    with db.conn() as c: return c.execute("SELECT 1 FROM suppression WHERE addr=?", (addr.lower(),)).fetchone() is not None

def _plan(inp: CampaignIn):
    _get(inp.analysis_id)
    if inp.audience == "selected":
        if not inp.customer_ids: raise HTTPException(400, "Select at least one customer.")
        with db.conn() as c:
            rows = [json.loads(c.execute("SELECT data FROM customers WHERE analysis_id=? AND customer_id=?", (inp.analysis_id, i)).fetchone()["data"])
                    for i in inp.customer_ids if c.execute("SELECT 1 FROM customers WHERE analysis_id=? AND customer_id=?", (inp.analysis_id, i)).fetchone()]
    else:
        rows = _query(inp.analysis_id, None, "will_leave", None, None, None)
    if inp.offer_id and inp.offer_id not in ml.OFFERS: raise HTTPException(400, "Unknown offer.")
    prov = notify.provider()
    plan, skipped = [], []
    for r in rows:
        ch = inp.channel
        if ch == "smart":
            if prov.mode == "live":
                if prov.can_email and not prov.can_sms and r.get("email"):
                    ch = "email"
                elif prov.can_sms and not prov.can_email and r.get("phone"):
                    ch = "sms"
                else:
                    ch = "sms" if r.get("phone") else "email" if r.get("email") else None
            else:
                ch = "sms" if r.get("phone") else "email" if r.get("email") else None
        addr = r["phone"] if ch in ("sms", "whatsapp") else r["email"] if ch == "email" else ""
        if not ch or not addr: skipped.append({"customer_id": r["customer_id"], "reason": "no contact for this channel"}); continue
        if _supp(addr): skipped.append({"customer_id": r["customer_id"], "reason": "opted out"}); continue
        oid = inp.offer_id or r["suggested_offer"] or "general"
        plan.append((r, ch, addr, oid))
    return plan, skipped

def _body(inp, r, oid):
    cust_name = (r.get("name") or "").strip()
    if not cust_name:
        cust_name = "عميلنا العزيز" if inp.lang == "ar" else "Customer"
    offer_obj = ml.OFFERS.get(oid, ml.OFFERS["general"])
    offer_title = (offer_obj.get("title_ar") if inp.lang == "ar" else offer_obj.get("title")) or offer_obj.get("title", "")
    text = inp.message.replace("{name}", cust_name).replace("{offer}", offer_title)
    return text + ("\n\nTo stop messages reply STOP / unsubscribe." if inp.lang == "en" else "\n\nلإيقاف الرسائل ارسل STOP.")

@app.post("/api/campaigns/preview")
def preview(inp: CampaignIn):
    plan, skipped = _plan(inp); by = {}
    for _, ch, _, _ in plan: by[ch] = by.get(ch, 0) + 1
    ex = [{"customer_id": r["customer_id"], "channel": ch, "to": a, "body": _body(inp, r, o)} for r, ch, a, o in plan[:3]]
    return {"will_send": len(plan), "by_channel": by, "skipped": len(skipped), "skipped_examples": skipped[:10], "examples": ex}

@app.post("/api/campaigns")
def send(inp: CampaignIn):
    if not inp.consent: raise HTTPException(400, "Consent is required: confirm customers agreed to receive messages.")
    plan, skipped = _plan(inp)
    if not plan: raise HTTPException(422, "Nobody can be contacted with these settings.")
    prov = notify.provider(); cid = db.new_id(); sent = failed = 0; by = {}
    with db._lock, db.conn() as c:
        for r, ch, addr, oid in plan:
            body = _body(inp, r, oid)
            cust_name = (r.get("name") or "").strip()
            subject = inp.subject.replace("{name}", cust_name) if cust_name else inp.subject.replace("{name}", "عميلنا العزيز" if inp.lang == "ar" else "Customer")
            res = prov.email(addr, subject, body) if ch == "email" else prov.whatsapp(addr, body) if ch == "whatsapp" else prov.sms(addr, body)
            ok, detail = res
            sent += ok; failed += (not ok); by[ch] = by.get(ch, 0) + 1
            c.execute("INSERT INTO messages VALUES(?,?,?,?,?,?,?)", (cid, r["customer_id"], ch, addr, "sent" if ok else "failed", detail, body))
        summary = {"recipients": len(plan), "sent": sent, "failed": failed, "skipped": len(skipped), "by_channel": by}
        c.execute("INSERT INTO campaigns VALUES(?,?,?,?,?,?,?,?)", (cid, db.now(), inp.analysis_id, inp.offer_id or "per_customer", inp.channel, inp.lang, prov.mode, json.dumps(summary)))
    return {"campaign_id": cid, "mode": prov.mode, **summary, "note": "Dry-run: nothing was actually sent." if prov.mode == "dryrun" else "Sent through live providers."}

@app.get("/api/campaigns")
def campaigns():
    with db.conn() as c:
        return [{"id": r["id"], "created": r["created"], "offer_id": r["offer_id"], "channel": r["channel"], "mode": r["mode"], **json.loads(r["summary"])}
                for r in c.execute("SELECT * FROM campaigns ORDER BY created DESC")]

@app.get("/api/campaigns/{cid}")
def campaign(cid: str, page: int = 1, page_size: int = 50):
    with db.conn() as c:
        r = c.execute("SELECT * FROM campaigns WHERE id=?", (cid,)).fetchone()
        if not r: raise HTTPException(404, "Campaign not found.")
        msgs = [dict(m) for m in c.execute("SELECT customer_id,channel,to_addr,status,detail FROM messages WHERE campaign_id=? LIMIT ? OFFSET ?", (cid, page_size, (page - 1) * page_size))]
    return {"id": cid, "created": r["created"], "mode": r["mode"], **json.loads(r["summary"]), "messages": msgs}

@app.get("/api/analyses")
def list_analyses():
    with db.conn() as c:
        rows = c.execute("SELECT id, created, filename, summary FROM analyses ORDER BY created DESC LIMIT 20").fetchall()
    return [{"id": r["id"], "created": r["created"], "filename": r["filename"], **{k: v for k, v in json.loads(r["summary"]).items() if k in ("total", "will_leave")}} for r in rows]

@app.get("/api/model/factors")
def model_factors():
    from ai.core import ml
    import numpy as np
    names = ml.PIPE.named_steps["pre"].get_feature_names_out()
    coef = ml.PIPE.named_steps["clf"].coef_[0]
    from ai.core.schema import CAT
    by_col: dict[str, float] = {}
    for nm, c in zip(names, coef):
        base = nm.split("__", 1)[1]
        col = next((k for k in CAT if base.startswith(k + "_")), base)
        by_col[col] = by_col.get(col, 0.0) + float(c)
    factors = [{"name": k, "direction": "churn" if v > 0 else "retain", "strength": round(abs(v), 3)} for k, v in sorted(by_col.items(), key=lambda x: -abs(x[1]))]
    return factors

@app.post("/api/unsubscribe")
def unsubscribe(u: Unsub):
    with db._lock, db.conn() as c: c.execute("INSERT OR REPLACE INTO suppression VALUES(?,?)", (u.address.strip().lower(), db.now()))
    return {"unsubscribed": u.address}
