"""AWS-native LLM (Anthropic) and email (SES SMTP) integrations for CareNest.
"""
from __future__ import annotations

import logging
import os
from email.message import EmailMessage
from typing import AsyncIterator, Optional

import aiosmtplib
from anthropic import AsyncAnthropic

logger = logging.getLogger(__name__)


def _env(key: str, default: str = "") -> str:
    value = os.environ.get(key)
    if value is None:
        return default
    value = str(value).strip()
    return value if value else default


async def send_email_ses(
    *,
    to_email: str,
    subject: str,
    html: str,
    reply_to: Optional[str] = None,
) -> Optional[str]:
    """Send HTML email via Amazon SES SMTP."""
    host = _env("SES_SMTP_HOST")
    user = _env("SES_SMTP_USER")
    password = _env("SES_SMTP_PASS")
    from_addr = _env("EMAIL_FROM", "info@carenesthomehealth.in")
    from_name = _env("EMAIL_FROM_NAME", "CareNest Home Health")
    port = int(_env("SES_SMTP_PORT", "587") or "587")

    if not host or not user or not password:
        logger.warning("SES SMTP not configured; skipping email send")
        return None

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{from_name} <{from_addr}>"
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content("This message requires an HTML-capable email client.")
    msg.add_alternative(html, subtype="html")

    try:
        await aiosmtplib.send(
            msg,
            hostname=host,
            port=port,
            username=user,
            password=password,
            start_tls=True,
        )
        return "ses-ok"
    except Exception as e:
        logger.error("SES email send failed: %s", e)
        return None


async def stream_anthropic_chat(
    *,
    session_id: str,
    user_message: str,
    system_prompt: str,
) -> AsyncIterator[str]:
    """Yield text deltas from Anthropic Messages API (SSE-friendly chunks)."""
    api_key = _env("ANTHROPIC_API_KEY")
    model = _env("ANTHROPIC_MODEL", "claude-sonnet-4-5-20250929")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not configured")

    client = AsyncAnthropic(api_key=api_key)
    async with client.messages.stream(
        model=model,
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    ) as stream:
        async for text in stream.text_stream:
            if text:
                yield text
