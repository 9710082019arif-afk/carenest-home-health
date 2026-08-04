# `backend/server.py` edits to leave Emergent

Apply these changes on your AWS deploy branch (after copying `aws_integrations.py`
into `backend/`).

## 1. Replace imports

**Remove:**

```python
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
```

**Add:**

```python
from aws_integrations import send_email_ses, stream_anthropic_chat
```

## 2. Replace env keys near the top

**Remove / stop requiring:**

```python
EMERGENT_LLM_KEY = ...
EMERGENT_EMAIL_KEY = ...
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
```

Keep `EMAIL_FROM_NAME`, `LEAD_NOTIFY_EMAIL`, `ADMIN_TOKEN`, Mongo settings.

## 3. Replace `send_email_async`

```python
async def send_email_async(to_email: str, subject: str, html: str, reply_to: Optional[str] = None):
    return await send_email_ses(
        to_email=to_email,
        subject=subject,
        html=html,
        reply_to=reply_to,
    )
```

## 4. Replace `chat_stream` body

Replace the `LlmChat` / `UserMessage` / `TextDelta` block with:

```python
@api.post("/chat/stream")
async def chat_stream(payload: ChatMessage):
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise HTTPException(status_code=500, detail="LLM key not configured")

    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": payload.session_id,
        "role": "user",
        "content": payload.message,
        "created_at": now_iso(),
    })

    assistant_buffer = {"text": ""}

    async def event_generator():
        try:
            async for chunk in stream_anthropic_chat(
                session_id=payload.session_id,
                user_message=payload.message,
                system_prompt=CHAT_SYSTEM_PROMPT,
            ):
                assistant_buffer["text"] += chunk
                yield f"data: {chunk}\n\n"
        except Exception as e:
            logger.error(f"chat stream error: {e}")
            yield f"data: [error] {str(e)}\n\n"
        finally:
            if assistant_buffer["text"]:
                await db.chat_messages.insert_one({
                    "id": str(uuid.uuid4()),
                    "session_id": payload.session_id,
                    "role": "assistant",
                    "content": assistant_buffer["text"],
                    "created_at": now_iso(),
                })
            yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
```

## 5. requirements.txt

```diff
- emergentintegrations==0.2.0
+ anthropic>=0.40.0
+ aiosmtplib>=3.0.0
```

## 6. Restart

```bash
sudo systemctl restart carenest-api
curl -sS http://127.0.0.1:8000/api/health
```
