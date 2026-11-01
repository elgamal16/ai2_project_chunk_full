"""Notification providers. Default is DRY-RUN: messages are only recorded, nothing is sent.
Set NOTIFY_MODE=live plus provider credentials (see README) to send for real."""
import os, smtplib, ssl
from pathlib import Path
from email.message import EmailMessage
import httpx

# Auto load .env if present without overwriting existing environment variables
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v

class Result(tuple):
    def __new__(cls, ok, detail=""): return super().__new__(cls, (ok, detail))

class DryRun:
    mode = "dryrun"
    can_sms = True
    can_whatsapp = True
    can_email = True
    def sms(self, to, body): return Result(True, "dry-run: not sent")
    def whatsapp(self, to, body): return Result(True, "dry-run: not sent")
    def email(self, to, subject, body): return Result(True, "dry-run: not sent")

class Live:
    mode = "live"
    def __init__(self):
        self.sid, self.tok = os.environ.get("TWILIO_ACCOUNT_SID"), os.environ.get("TWILIO_AUTH_TOKEN")
        self.sms_from, self.wa_from = os.environ.get("TWILIO_SMS_FROM"), os.environ.get("TWILIO_WHATSAPP_FROM")
        self.smtp = dict(host=os.environ.get("SMTP_HOST"), port=int(os.environ.get("SMTP_PORT", "587")),
                         user=os.environ.get("SMTP_USER"), pw=os.environ.get("SMTP_PASSWORD"), sender=os.environ.get("SMTP_FROM"))

    @property
    def can_sms(self):
        return bool(self.sid and self.tok and self.sms_from)

    @property
    def can_whatsapp(self):
        return bool(self.sid and self.tok and self.wa_from)

    @property
    def can_email(self):
        s = self.smtp
        return bool(s.get("host") and s.get("sender") and s.get("pw"))

    def _twilio(self, frm, to, body):
        if not (self.sid and self.tok and frm): return Result(False, "Twilio is not configured")
        try:
            r = httpx.post(f"https://api.twilio.com/2010-04-01/Accounts/{self.sid}/Messages.json", auth=(self.sid, self.tok),
                           data={"From": frm, "To": to, "Body": body}, timeout=15)
            return Result(r.status_code < 300, "sent" if r.status_code < 300 else r.text[:200])
        except Exception as e: return Result(False, str(e)[:200])

    def sms(self, to, body):
        to_addr = to.replace("whatsapp:", "")
        return self._twilio(self.sms_from, to_addr, body)

    def whatsapp(self, to, body):
        if not self.wa_from: return Result(False, "WhatsApp is not configured")
        frm = self.wa_from if self.wa_from.startswith("whatsapp:") else f"whatsapp:{self.wa_from}"
        to_addr = to if to.startswith("whatsapp:") else f"whatsapp:{to}"
        return self._twilio(frm, to_addr, body)
    def email(self, to, subject, body):
        s = self.smtp
        if not (s["host"] and s["sender"]): return Result(False, "SMTP is not configured")
        try:
            m = EmailMessage(); m["From"], m["To"], m["Subject"] = s["sender"], to, subject; m.set_content(body)
            with smtplib.SMTP(s["host"], s["port"], timeout=15) as srv:
                srv.starttls(context=ssl.create_default_context())
                if s["user"]: srv.login(s["user"], s["pw"])
                srv.send_message(m)
            return Result(True, "sent")
        except Exception as e: return Result(False, str(e)[:200])

def provider(): return Live() if os.environ.get("NOTIFY_MODE", "dryrun") == "live" else DryRun()
