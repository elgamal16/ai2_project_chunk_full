"""Trains the model with the same choices as the notebook (drop customerID & TotalCharges, 80/20 split,
random_state=42, Logistic Regression) but inside one Pipeline so the same steps run on uploaded files.
Run from the project root: python -m ai.train"""
import json, joblib, numpy as np, pandas as pd
from pathlib import Path
np.seterr(divide="ignore", over="ignore", invalid="ignore")
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from ai.core.schema import CAT, NUM, FEATURES

ROOT = Path(__file__).resolve().parent.parent
df = pd.read_csv(ROOT / "data" / "telco_original.csv")
X, y = df[FEATURES], (df.Churn == "Yes").astype(int)
Xtr, Xte, ytr, yte = train_test_split(X, y, train_size=0.8, random_state=42)
pre = ColumnTransformer([("cat", OneHotEncoder(handle_unknown="ignore", drop="if_binary"), CAT),
                         ("num", StandardScaler(), NUM)])
pipe = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))]).fit(Xtr, ytr)
p, pr = pipe.predict(Xte), pipe.predict_proba(Xte)[:, 1]
m = dict(train_accuracy=round(accuracy_score(ytr, pipe.predict(Xtr)) * 100, 2), accuracy=round(accuracy_score(yte, p) * 100, 2),
         precision=round(precision_score(yte, p) * 100, 1), recall=round(recall_score(yte, p) * 100, 1),
         f1=round(f1_score(yte, p) * 100, 1), roc_auc=round(roc_auc_score(yte, pr), 3),
         confusion_matrix=confusion_matrix(yte, p).tolist(), n_train=len(Xtr), n_test=len(Xte))
# training mean of transformed features: used to explain each prediction relative to an average customer
mean = pipe.named_steps["pre"].transform(Xtr).mean(axis=0)
mean = mean.toarray().ravel() if hasattr(mean, "toarray") else mean.ravel() if hasattr(mean, "ravel") else mean
joblib.dump(dict(pipe=pipe, mean=mean, metrics=m), ROOT / "ai" / "model" / "model.joblib")
json.dump(m, open(ROOT / "ai" / "model" / "metrics.json", "w"), indent=1); print(m)
