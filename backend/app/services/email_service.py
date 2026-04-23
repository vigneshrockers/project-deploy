import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def send_reset_code_email(to_email: str, reset_code: str, full_name: str | None = None) -> None:
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_from_email = os.getenv("SMTP_FROM_EMAIL", smtp_username).strip()
    smtp_use_tls = _as_bool(os.getenv("SMTP_USE_TLS"), True)
    smtp_use_ssl = _as_bool(os.getenv("SMTP_USE_SSL"), False)

    if not smtp_host or not smtp_from_email:
        raise RuntimeError("Email service is not configured on the server.")

    greeting_name = full_name or "there"

    message = EmailMessage()
    message["Subject"] = "Trend-Fx password reset code"
    message["From"] = smtp_from_email
    message["To"] = to_email
    message.set_content(
        "\n".join(
            [
                f"Hi {greeting_name},",
                "",
                "Use this Trend-Fx password reset code to reset your password:",
                "",
                f"    {reset_code}",
                "",
                "This code expires in 30 minutes.",
                "If you did not request this, you can ignore this email.",
            ]
        )
    )

    if smtp_use_ssl:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as server:
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.send_message(message)
        return

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        if smtp_use_tls:
            server.starttls()
        if smtp_username and smtp_password:
            server.login(smtp_username, smtp_password)
        server.send_message(message)
