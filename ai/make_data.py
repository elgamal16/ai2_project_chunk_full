"""Adds PhoneNumber and Email columns (synthetic, fake) to the Telco dataset.
Emails use the reserved example.com domain and phones are random, so no real person can be messaged.
Run from the project root: python -m ai.make_data"""
import pandas as pd, numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rng = np.random.default_rng(42)
df = pd.read_csv(ROOT / "data" / "telco_original.csv")
n = len(df)
kind = rng.choice(["both", "phone", "email", "none"], size=n, p=[.70, .12, .12, .06])
prefix = rng.choice(["10", "11", "12", "15"], size=n)
phone = [f"+20{p}{rng.integers(0, 10**8):08d}" for p in prefix]
email = [f"{cid.lower().replace('-', '')}@example.com" for cid in df.customerID]
df["PhoneNumber"] = [p if k in ("both", "phone") else "" for p, k in zip(phone, kind)]
df["Email"] = [e if k in ("both", "email") else "" for e, k in zip(email, kind)]
# ~1% invalid formats, so the validation screen has something to show
bad = rng.choice(np.where(df.PhoneNumber != "")[0], size=70, replace=False)
df.loc[bad, "PhoneNumber"] = df.loc[bad, "PhoneNumber"].str[3:8]
bad = rng.choice(np.where(df.Email != "")[0], size=50, replace=False)
df.loc[bad, "Email"] = df.loc[bad, "Email"].str.replace("@", "", regex=False)
df.to_csv(ROOT / "data" / "telco_with_contacts.csv", index=False)
df.sample(200, random_state=1).drop(columns=["Churn"]).to_csv(ROOT / "data" / "sample_upload.csv", index=False)
print(df[["customerID", "PhoneNumber", "Email"]].head(4)); print(kind[:0], pd.Series(kind).value_counts().to_dict())
