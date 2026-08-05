"""Environment loading helpers for CareNest backend.

Emergent preview keeps secrets in .env files; Emergent production injects the
same keys as process env. python-dotenv's default override=False treats an
empty string as "already set", so a stale/placeholder `GA_MEASUREMENT_ID=` in
the process environment blocks a real value from backend/.env — which made
GET /api/config/public return {"ga_id": ""}.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable

from dotenv import dotenv_values, load_dotenv


def apply_dotenv_file(path: Path) -> bool:
    """Load one .env file, filling keys that are missing OR blank in os.environ."""
    if not path.is_file():
        return False
    load_dotenv(path, override=False)
    for key, value in dotenv_values(path).items():
        if value is None:
            continue
        value = str(value).strip()
        if not value:
            continue
        current = os.environ.get(key)
        if current is None or str(current).strip() == "":
            os.environ[key] = value
    return True


def load_environment(root_dir: Path, extra_candidates: Iterable[Path] | None = None) -> None:
    """Load Emergent/workspace env files from the paths this stack actually uses."""
    candidates = [
        root_dir / ".env",  # /app/backend/.env (canonical)
        root_dir.parent / ".env",  # /app/.env (sometimes used by platform/UI)
    ]
    if extra_candidates:
        candidates.extend(extra_candidates)
    for path in candidates:
        apply_dotenv_file(path)


def env_str(key: str, default: str = "") -> str:
    """Read an env var; treat missing/whitespace-only as default."""
    value = os.environ.get(key)
    if value is None:
        return default
    value = str(value).strip()
    return value if value else default
