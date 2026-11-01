import io, os, tempfile
os.environ["NOTIFY_MODE"] = "dryrun"
os.environ["CHURN_DB"] = os.path.join(tempfile.mkdtemp(), "t.db")
import pandas as pd
from fastapi.testclient import TestClient
from backend.main import app
c = TestClient(app)
full = pd.read_csv("data/telco_with_contacts.csv", dtype=str, keep_default_na=False)
def up(df, name="x.csv"): return {"file": (name, df.drop(columns=["Churn"]).to_csv(index=False).encode(), "text/csv")}

def test_health(): assert c.get("/api/health").json()["notify_mode"] == "dryrun"
def test_validate_contacts():
    j = c.post("/api/validate", files=up(full)).json()
    assert j["rows"] == 7043 and not j["missing_columns"] and j["contacts"]["invalid_phone"] > 0 and j["contacts"]["neither"] > 300
def test_missing_columns():
    r = c.post("/api/analyze", files=up(full.drop(columns=["Contract"])))
    assert r.status_code == 422 and "Contract" in r.json()["detail"]["missing_columns"]
def test_bad_file_type():
    assert c.post("/api/analyze", files={"file": ("a.txt", b"hi", "text/plain")}).status_code == 400
def test_bad_values_skipped():
    d = full.head(50).copy(); d.loc[3, "tenure"] = "abc"; d.loc[4, "Contract"] = "Weekly"
    j = c.post("/api/analyze", files=up(d)).json()
    assert j["summary"]["total"] == 48 and j["summary"]["skipped_rows"] == 2
def test_full_flow():
    j = c.post("/api/analyze", files=up(full)).json(); aid = j["analysis_id"]; s = j["summary"]
    assert s["total"] == 7043 and 0.2 < s["churn_rate"] / 100 < 0.35
    # accuracy against the real labels (this model was trained on 80% of this file, so report only as a sanity check)
    items = c.get(f"/api/analyses/{aid}/customers", params={"page_size": 500, "prediction": "will_leave"}).json()
    assert items["total"] == s["will_leave"] and items["items"][0]["risk_score"] >= items["items"][-1]["risk_score"]
    assert items["items"][0]["reasons"] and items["items"][0]["suggested_offer"]
    assert c.get(f"/api/analyses/{aid}/customers", params={"contact": "none"}).json()["total"] > 0
    assert c.get(f"/api/analyses/{aid}/export.csv").text.startswith("customer_id")
    body = {"analysis_id": aid, "audience": "high_risk", "channel": "smart"}
    assert c.post("/api/campaigns", json=body).status_code == 400  # no consent
    p = c.post("/api/campaigns/preview", json=body).json(); assert p["will_send"] > 0 and p["skipped"] >= 0
    r = c.post("/api/campaigns", json={**body, "consent": True}).json()
    assert r["mode"] == "dryrun" and r["sent"] == p["will_send"] and r["failed"] == 0
    cid = r["campaign_id"]; assert c.get(f"/api/campaigns/{cid}").json()["messages"]
    # opt-out is honoured
    first = c.get(f"/api/campaigns/{cid}?page_size=1").json()["messages"][0]["to_addr"]
    c.post("/api/unsubscribe", json={"address": first})
    r2 = c.post("/api/campaigns", json={**body, "consent": True}).json()
    assert r2["recipients"] == r["recipients"] - 1
    # 2 manual campaigns + 2 auto-notify campaigns (one per /api/analyze call)
    all_campaigns = c.get("/api/campaigns").json()
    assert len(all_campaigns) >= 2
def test_xlsx():
    buf = io.BytesIO(); full.head(30).drop(columns=["Churn"]).to_excel(buf, index=False)
    j = c.post("/api/analyze", files={"file": ("a.xlsx", buf.getvalue(), "application/vnd.ms-excel")}).json()
    assert j["summary"]["total"] == 30
