"""
Backend API tests for CareNest Home Health.
Covers: root, leads, appointments, contact, newsletter, careers, chat SSE, config/public.
"""
import os
import time
import uuid
import json
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://elite-homecare-ui.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ------------------------- Fixtures -------------------------
@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------------------------- Root & Health -------------------------
def test_root_ok(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert "service" in data
    assert data["status"] == "ok"


def test_health(client):
    r = client.get(f"{API}/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"


# ------------------------- Config -------------------------
def test_public_config(client):
    r = client.get(f"{API}/config/public")
    assert r.status_code == 200
    data = r.json()
    assert data["company"]
    assert data["phone"]
    assert data["whatsapp"]
    assert data["email"]


# ------------------------- Leads -------------------------
def test_create_lead_and_persist(client):
    payload = {
        "name": f"TEST_Lead_{uuid.uuid4().hex[:6]}",
        "phone": "+919000000001",
        "city": "Pune",
        "service": "Home Nursing",
        "email": "test_lead@example.com",
    }
    r = client.post(f"{API}/leads", json=payload)
    assert r.status_code == 200
    lead = r.json()
    assert lead["id"]
    assert lead["status"] == "new"
    assert lead["name"] == payload["name"]

    # Verify via GET /api/leads
    time.sleep(0.5)
    r2 = client.get(f"{API}/leads?limit=200")
    assert r2.status_code == 200
    leads = r2.json()
    assert any(l["id"] == lead["id"] for l in leads)


def test_lead_validation_error(client):
    r = client.post(f"{API}/leads", json={"name": "a", "phone": "12"})
    # name < 2 fails Field(min_length=2)
    assert r.status_code == 422


# ------------------------- Appointments -------------------------
def test_create_appointment(client):
    payload = {
        "patient_name": f"TEST_Patient_{uuid.uuid4().hex[:6]}",
        "phone": "+919000000002",
        "city": "Mumbai",
        "service": "ICU at Home",
        "preferred_date": "2026-02-15",
        "preferred_time": "10:00",
    }
    r = client.post(f"{API}/appointments", json=payload)
    assert r.status_code == 200
    appt = r.json()
    assert appt["id"]
    assert appt["status"] == "pending"
    assert appt["patient_name"] == payload["patient_name"]

    time.sleep(0.5)
    r2 = client.get(f"{API}/appointments?limit=200")
    assert r2.status_code == 200
    appts = r2.json()
    assert any(a["id"] == appt["id"] for a in appts)


# ------------------------- Contact -------------------------
def test_contact(client):
    payload = {
        "name": f"TEST_Contact_{uuid.uuid4().hex[:6]}",
        "email": "test_contact@example.com",
        "message": "This is a test message from automated backend_test.",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert data["id"]


# ------------------------- Newsletter -------------------------
def test_newsletter_subscribe_and_dedupe(client):
    email = f"test_news_{uuid.uuid4().hex[:8]}@example.com"
    r1 = client.post(f"{API}/newsletter", json={"email": email})
    assert r1.status_code == 200
    d1 = r1.json()
    assert d1["ok"] is True
    assert d1["already_subscribed"] is False

    r2 = client.post(f"{API}/newsletter", json={"email": email})
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["already_subscribed"] is True


# ------------------------- Careers -------------------------
def test_career_apply(client):
    payload = {
        "name": f"TEST_Career_{uuid.uuid4().hex[:6]}",
        "phone": "+919000000003",
        "role": "Registered Nurse",
    }
    r = client.post(f"{API}/careers/apply", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert data["id"]


# ------------------------- Chat SSE -------------------------
def test_chat_stream_sse():
    session_id = f"test-session-{uuid.uuid4().hex[:8]}"
    url = f"{API}/chat/stream"
    payload = {"session_id": session_id, "message": "Hi, do you offer ICU at home in Pune?"}

    with requests.post(url, json=payload, stream=True, timeout=60) as resp:
        assert resp.status_code == 200
        ct = resp.headers.get("content-type", "")
        assert "text/event-stream" in ct, f"Unexpected content-type: {ct}"

        got_data_frame = False
        got_done = False
        total_text = ""
        start = time.time()
        for line in resp.iter_lines(decode_unicode=True):
            if line is None:
                continue
            if line.startswith("data:"):
                got_data_frame = True
                content = line[5:].strip()
                total_text += content + " "
                if "[DONE]" in content:
                    got_done = True
                    break
            if time.time() - start > 55:
                break

        assert got_data_frame, "No data frame received in SSE stream"
        assert got_done, "SSE stream did not terminate with [DONE]"
        assert len(total_text) > 5, "Empty response text"

    # History check
    time.sleep(1.0)
    hr = requests.get(f"{API}/chat/history/{session_id}")
    assert hr.status_code == 200
    msgs = hr.json()
    assert len(msgs) >= 1
    roles = {m["role"] for m in msgs}
    assert "user" in roles
