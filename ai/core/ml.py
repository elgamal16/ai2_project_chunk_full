import io, re
import joblib, numpy as np, pandas as pd
from pathlib import Path
from .schema import *

np.seterr(divide="ignore", over="ignore", invalid="ignore")

_M = joblib.load(Path(__file__).resolve().parent.parent / "model" / "model.joblib")
PIPE, MEAN, METRICS = _M["pipe"], _M["mean"], _M["metrics"]
PHONE_RE = re.compile(r"^\+?\d{10,15}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

LABELS = {  # plain-language reason text for a feature value (code, text)
    ("Contract", "Month-to-month"): ("month_to_month", "Month-to-month contract (can leave any time)"),
    ("Contract", "One year"): ("one_year", "One-year contract"),
    ("Contract", "Two year"): ("two_year", "Two-year contract"),
    ("InternetService", "Fiber optic"): ("fiber", "Fiber optic internet"),
    ("InternetService", "DSL"): ("dsl", "DSL internet"),
    ("InternetService", "No"): ("no_internet", "No internet service"),
    ("PaymentMethod", "Electronic check"): ("echeck", "Pays by electronic check"),
    ("TechSupport", "No"): ("no_techsupport", "No tech support"),
    ("OnlineSecurity", "No"): ("no_security", "No online security"),
    ("OnlineBackup", "No"): ("no_backup", "No online backup"),
    ("DeviceProtection", "No"): ("no_protection", "No device protection"),
    ("PaperlessBilling", "Yes"): ("paperless", "Paperless billing"),
    ("StreamingTV", "Yes"): ("streaming_tv", "Streams TV"),
    ("StreamingMovies", "Yes"): ("streaming_movies", "Streams movies"),
    ("Partner", "No"): ("no_partner", "No partner"),
    ("Dependents", "No"): ("no_dependents", "No dependents"),
    ("PhoneService", "Yes"): ("phone_service", "Has phone service"),
    ("MultipleLines", "Yes"): ("multi_lines", "Multiple phone lines"),
}

def read_upload(name: str, raw: bytes) -> pd.DataFrame:
    n = name.lower()
    try:
        if n.endswith((".xlsx", ".xlsm")):
            df = pd.read_excel(io.BytesIO(raw), dtype=str)
        elif n.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(raw), dtype=str, keep_default_na=False, encoding="utf-8-sig")
        else:
            raise ValueError("Unsupported file type. Upload a .csv or .xlsx file.")
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Could not read the file: {e}")
    df.columns = [str(c).strip() for c in df.columns]
    df = df.fillna("")
    for c in df.columns:
        df[c] = df[c].astype(str).str.strip()
    return df.loc[~(df == "").all(axis=1)].reset_index(drop=True)

def normalize_phone(v: str) -> str:
    v = re.sub(r"[\s\-()]", "", v or "")
    if v.startswith("00"): v = "+" + v[2:]
    if re.fullmatch(r"0?1[0125]\d{8}", v): v = "+20" + v.lstrip("0")  # Egyptian mobile
    return v

def check_file(df: pd.DataFrame) -> dict:
    """Column + value validation. Returns errors (block analysis), problem rows, and contact stats."""
    missing = [c for c in [ID_COL] + FEATURES if c not in df.columns]
    result = {"rows": len(df), "columns_found": list(df.columns), "missing_columns": missing,
              "has_phone_column": PHONE_COL in df.columns, "has_email_column": EMAIL_COL in df.columns,
              "problems": [], "contacts": {}, "ok": False}
    if len(df) == 0:
        result["problems"].append({"row": None, "column": None, "issue": "The file has no data rows."}); return result
    if missing: return result
    prob = []
    if df[ID_COL].duplicated().any():
        for i in df.index[df[ID_COL].duplicated(keep="first")]:
            prob.append({"row": int(i) + 2, "column": ID_COL, "issue": "Duplicate customer ID"})
    for c in CAT:
        bad = ~df[c].isin(ALLOWED[c])
        for i in df.index[bad]:
            prob.append({"row": int(i) + 2, "column": c, "issue": f"Invalid value '{df.at[i, c]}'"})
    for c in NUM:
        v = pd.to_numeric(df[c], errors="coerce")
        lo, hi = RANGES[c]
        for i in df.index[v.isna() | (v < lo) | (v > hi)]:
            prob.append({"row": int(i) + 2, "column": c, "issue": f"Must be a number from {lo} to {hi}"})
    ph = df[PHONE_COL].map(normalize_phone) if result["has_phone_column"] else pd.Series([""] * len(df))
    em = df[EMAIL_COL] if result["has_email_column"] else pd.Series([""] * len(df))
    ph_ok, em_ok = ph.map(lambda x: bool(PHONE_RE.match(x))), em.map(lambda x: bool(EMAIL_RE.match(x)))
    ph_bad, em_bad = (ph != "") & ~ph_ok, (em != "") & ~em_ok
    result["contacts"] = {"phone_only": int((ph_ok & ~em_ok).sum()), "email_only": int((~ph_ok & em_ok).sum()),
                          "both": int((ph_ok & em_ok).sum()), "neither": int((~ph_ok & ~em_ok).sum()),
                          "invalid_phone": int(ph_bad.sum()), "invalid_email": int(em_bad.sum())}
    for i in df.index[ph_bad]: prob.append({"row": int(i) + 2, "column": PHONE_COL, "issue": "Invalid phone number (customer can still be analysed)", "level": "warning"})
    for i in df.index[em_bad]: prob.append({"row": int(i) + 2, "column": EMAIL_COL, "issue": "Invalid email address (customer can still be analysed)", "level": "warning"})
    for p in prob: p.setdefault("level", "error")
    result["problems"] = prob
    result["blocking_rows"] = len({p["row"] for p in prob if p["level"] == "error"})
    result["ok"] = True  # rows with errors are skipped, others analysed
    return result

def _reasons(Xt, row_idx, raw_row, topn=3):
    """Per-column contribution = sum over its encoded features of coef * (x - training mean).
    Positive means this customer's value pushes churn risk up compared with an average customer."""
    names = PIPE.named_steps["pre"].get_feature_names_out()
    coef = PIPE.named_steps["clf"].coef_[0]
    contrib = coef * (Xt[row_idx] - MEAN)
    by_col = {}
    for nm, c in zip(names, contrib):
        base = nm.split("__", 1)[1]
        col = next((k for k in CAT if base.startswith(k + "_")), base)
        by_col[col] = by_col.get(col, 0.0) + float(c)
    out = []
    for col, c in sorted(by_col.items(), key=lambda kv: -kv[1]):
        if c <= 0.05 or len(out) >= topn: break
        if col == "tenure":
            t = int(float(raw_row["tenure"])); key = ("short_tenure", f"Only {t} month{'' if t == 1 else 's'} as a customer") if t < 24 else None
        elif col == "MonthlyCharges":
            key = ("high_bill", f"High monthly bill ({float(raw_row['MonthlyCharges']):.0f})") if float(raw_row["MonthlyCharges"]) > 65 else None
        elif col == "SeniorCitizen":
            key = ("senior", "Senior citizen") if str(raw_row["SeniorCitizen"]) == "1" else None
        else:
            key = LABELS.get((col, raw_row[col]))
        if key: out.append({"code": key[0], "text": key[1], "impact": round(c, 2)})
    return out

OFFERS = {
    "annual_discount": {"id": "annual_discount", "title": "20% off when you move to a 1-year plan", "title_ar": "خصم 20% عند التجديد أو الترقية لباقة سنوية", "when": ["month_to_month"]},
    "free_support": {"id": "free_support", "title": "3 months of free tech support", "title_ar": "3 أشهر دعم فني مجاني مع أولوية في الخدمة", "when": ["no_techsupport", "no_security", "no_backup", "no_protection"]},
    "fiber_credit": {"id": "fiber_credit", "title": "2 months of fiber price credit", "title_ar": "رصيد مجاني لمدة شهرين على باقات الفايبر", "when": ["fiber", "high_bill"]},
    "welcome_gift": {"id": "welcome_gift", "title": "Loyalty gift: 5 GB free data", "title_ar": "هدية ولاء: 5 جيجابايت إنترنت إضافية مجاناً", "when": ["short_tenure"]},
    "autopay_bonus": {"id": "autopay_bonus", "title": "10% off for switching to automatic payment", "title_ar": "خصم 10% عند تفعيل خاصية الدفع التلقائي", "when": ["echeck"]},
    "general": {"id": "general", "title": "10% off your next 3 bills", "title_ar": "خصم خاص 10% على فواتيرك للـ 3 أشهر القادمة", "when": []},
}

def suggest_offer(reasons):
    codes = [r["code"] for r in reasons]
    for o in OFFERS.values():
        if any(c in o["when"] for c in codes): return o["id"]
    return "general"

def analyze(df: pd.DataFrame, check: dict) -> list[dict]:
    err_rows = {p["row"] for p in check["problems"] if p["level"] == "error"}
    keep = [i for i in df.index if (i + 2) not in err_rows]
    d = df.loc[keep].copy()
    X = d[FEATURES].copy()
    for c in NUM: X[c] = pd.to_numeric(X[c])
    prob = PIPE.predict_proba(X)[:, 1]
    Xt = PIPE.named_steps["pre"].transform(X)
    Xt = Xt.toarray() if hasattr(Xt, "toarray") else np.asarray(Xt)
    rows = []
    for k, (i, p) in enumerate(zip(keep, prob)):
        r = df.loc[i]
        reasons = _reasons(Xt, k, X.iloc[k]) if p >= 0.30 else []
        phone = normalize_phone(r.get(PHONE_COL, "")); email = r.get(EMAIL_COL, "")
        phone = phone if PHONE_RE.match(phone) else ""; email = email if EMAIL_RE.match(email) else ""
        name = str(r.get("Name") or r.get("name") or r.get("customer_name") or r.get("FullName") or "").strip()
        score = round(float(p) * 100)
        rows.append({"customer_id": r[ID_COL], "name": name, "phone": phone, "email": email, "contract": r["Contract"],
                     "tenure": int(float(r["tenure"])), "monthly_charges": float(r["MonthlyCharges"]),
                     "internet": r["InternetService"], "risk_score": score,
                     "risk_level": "high" if p >= 0.5 else "medium" if p >= 0.3 else "low",
                     "prediction": "will_leave" if p >= 0.5 else "will_stay",
                     "reasons": reasons, "main_reason": reasons[0]["text"] if reasons else "",
                     "suggested_offer": suggest_offer(reasons) if p >= 0.3 else None})
    return rows

def summarize(rows):
    n = len(rows); leave = sum(r["prediction"] == "will_leave" for r in rows)
    lv = {k: sum(r["risk_level"] == k for r in rows) for k in ("low", "medium", "high")}
    by_contract = {}
    for r in rows:
        d = by_contract.setdefault(r["contract"], {"total": 0, "will_leave": 0}); d["total"] += 1; d["will_leave"] += r["prediction"] == "will_leave"
    reach = {"sms": sum(bool(r["phone"]) for r in rows if r["prediction"] == "will_leave"),
             "email": sum(bool(r["email"]) for r in rows if r["prediction"] == "will_leave"),
             "unreachable": sum(not r["phone"] and not r["email"] for r in rows if r["prediction"] == "will_leave")}
    return {"total": n, "will_leave": leave, "will_stay": n - leave, "churn_rate": round(100 * leave / n, 1) if n else 0,
            "risk_levels": lv, "by_contract": by_contract, "high_risk_reachable": reach}
