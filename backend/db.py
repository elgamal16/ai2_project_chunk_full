import json, os, sqlite3, threading, uuid
from datetime import datetime, timezone
DB = os.environ.get("CHURN_DB", "churn.db")
_lock = threading.Lock()
def conn():
    c = sqlite3.connect(DB, check_same_thread=False); c.row_factory = sqlite3.Row; return c
def init():
    with conn() as c:
        c.executescript("""
        CREATE TABLE IF NOT EXISTS analyses(id TEXT PRIMARY KEY, created TEXT, filename TEXT, summary TEXT, check_json TEXT);
        CREATE TABLE IF NOT EXISTS customers(analysis_id TEXT, customer_id TEXT, data TEXT, risk_score INT, risk_level TEXT, prediction TEXT, contract TEXT,
            PRIMARY KEY(analysis_id, customer_id));
        CREATE TABLE IF NOT EXISTS campaigns(id TEXT PRIMARY KEY, created TEXT, analysis_id TEXT, offer_id TEXT, channel TEXT, lang TEXT, mode TEXT, summary TEXT);
        CREATE TABLE IF NOT EXISTS messages(campaign_id TEXT, customer_id TEXT, channel TEXT, to_addr TEXT, status TEXT, detail TEXT, body TEXT);
        CREATE TABLE IF NOT EXISTS suppression(addr TEXT PRIMARY KEY, created TEXT);
        """)
def now(): return datetime.now(timezone.utc).isoformat(timespec="seconds")
def new_id(): return uuid.uuid4().hex[:12]
def save_analysis(filename, summary, check, rows):
    aid = new_id()
    with _lock, conn() as c:
        c.execute("INSERT INTO analyses VALUES(?,?,?,?,?)", (aid, now(), filename, json.dumps(summary), json.dumps({k: v for k, v in check.items() if k != "problems"} | {"problem_count": len(check["problems"])})))
        c.executemany("INSERT OR REPLACE INTO customers VALUES(?,?,?,?,?,?,?)", [(aid, r["customer_id"], json.dumps(r), r["risk_score"], r["risk_level"], r["prediction"], r["contract"]) for r in rows])
    return aid
