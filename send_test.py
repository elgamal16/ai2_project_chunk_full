"""Sends a test offer to YOU only.
  python send_test.py --phone 01012345678 --email you@gmail.com            (dry-run: nothing is sent)
  NOTIFY_MODE=live python send_test.py --phone ... --email ... --channel email   (real send)
It adds your own high-risk customer row to a copy of the sample file, runs the full analysis, and messages only that row."""
import argparse, os, tempfile
os.environ.setdefault("CHURN_DB", os.path.join(tempfile.mkdtemp(), "test.db"))
import pandas as pd
from fastapi.testclient import TestClient
from backend.main import app

ap = argparse.ArgumentParser()
ap.add_argument("--phone", default=""); ap.add_argument("--email", default="")
ap.add_argument("--channel", choices=["sms", "whatsapp", "email", "smart"], default="smart")
ap.add_argument("--lang", choices=["en", "ar"], default="ar")
a = ap.parse_args()
if not (a.phone or a.email): ap.error("give --phone and/or --email")

df = pd.read_csv("data/sample_upload.csv", dtype=str, keep_default_na=False)
me = df.iloc[0].copy()
me.update({"customerID": "ME-0001", "gender": "Male", "SeniorCitizen": "0", "Partner": "No", "Dependents": "No", "tenure": "2",
           "PhoneService": "Yes", "MultipleLines": "No", "InternetService": "Fiber optic", "OnlineSecurity": "No", "OnlineBackup": "No",
           "DeviceProtection": "No", "TechSupport": "No", "StreamingTV": "No", "StreamingMovies": "No", "Contract": "Month-to-month",
           "PaperlessBilling": "Yes", "PaymentMethod": "Electronic check", "MonthlyCharges": "89.9", "PhoneNumber": a.phone, "Email": a.email})
df = pd.concat([df, me.to_frame().T], ignore_index=True)

c = TestClient(app)
r = c.post("/api/analyze", files={"file": ("mine.csv", df.to_csv(index=False).encode(), "text/csv")}).json()
row = c.get(f"/api/analyses/{r['analysis_id']}/customers", params={"q": "ME-0001"}).json()["items"][0]
print(f"Your row: risk {row['risk_score']}/100 -> {row['prediction']} | reasons: {[x['text'] for x in row['reasons']]}")
print(f"Contact found: phone={row['phone'] or '-'}  email={row['email'] or '-'}")
if row["prediction"] != "will_leave": raise SystemExit("Not high risk, so no message is sent. Change the row values.")
msg = ("مرحبًا {name}، إحنا بنقدّر وجودك معانا. خد العرض ده: {offer}." if a.lang == "ar" else "Hello {name}, we value you. Enjoy this offer: {offer}.")
res = c.post("/api/campaigns", json={"analysis_id": r["analysis_id"], "audience": "selected", "customer_ids": ["ME-0001"], "channel": a.channel,
                                     "lang": a.lang, "message": msg, "subject": "عرض خاص ليك" if a.lang == "ar" else "A special offer for you", "consent": True})
print(res.status_code, res.json())
if res.status_code == 200:
    d = c.get(f"/api/campaigns/{res.json()['campaign_id']}").json()["messages"]; print("Delivery:", d)
