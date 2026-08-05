"""Unit tests for blank-aware dotenv loading used by /api/config/public."""
import os
from pathlib import Path

from env_utils import apply_dotenv_file, env_str, load_environment


def test_blank_process_env_is_filled_from_dotenv(tmp_path, monkeypatch):
    env_file = tmp_path / ".env"
    env_file.write_text("GA_MEASUREMENT_ID=G-FROMFILE\nGTM_ID=GTM-FROMFILE\n")

    # Simulate Emergent injecting empty placeholders into the process env.
    monkeypatch.setenv("GA_MEASUREMENT_ID", "")
    monkeypatch.setenv("GTM_ID", "")

    assert apply_dotenv_file(env_file) is True
    assert env_str("GA_MEASUREMENT_ID") == "G-FROMFILE"
    assert env_str("GTM_ID") == "GTM-FROMFILE"


def test_env_str_treats_whitespace_as_empty(monkeypatch):
    monkeypatch.setenv("GA_MEASUREMENT_ID", "   ")
    assert env_str("GA_MEASUREMENT_ID") == ""
    monkeypatch.setenv("GA_MEASUREMENT_ID", "G-ABC123")
    assert env_str("GA_MEASUREMENT_ID") == "G-ABC123"


def test_load_environment_checks_backend_and_parent(tmp_path, monkeypatch):
    backend = tmp_path / "backend"
    backend.mkdir()
    (tmp_path / ".env").write_text("GA_MEASUREMENT_ID=G-PARENT\n")
    monkeypatch.delenv("GA_MEASUREMENT_ID", raising=False)

    load_environment(backend)
    assert os.environ.get("GA_MEASUREMENT_ID") == "G-PARENT"


def test_backend_env_overrides_blank_even_if_parent_empty(tmp_path, monkeypatch):
    backend = tmp_path / "backend"
    backend.mkdir()
    (backend / ".env").write_text("GA_MEASUREMENT_ID=G-BACKEND\n")
    (tmp_path / ".env").write_text("GA_MEASUREMENT_ID=\n")
    monkeypatch.setenv("GA_MEASUREMENT_ID", "")

    load_environment(backend)
    assert env_str("GA_MEASUREMENT_ID") == "G-BACKEND"
