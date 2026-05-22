import logging
from dataclasses import dataclass
from fastapi import Header, HTTPException
from database.supabase_client import get_client

logger = logging.getLogger(__name__)


@dataclass
class AuthUser:
    id: str
    level: int
    market: str
    track: str
    language: str


def get_current_user(authorization: str = Header(...)) -> AuthUser:
    """Verify Supabase JWT and return the authenticated user's profile."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization[7:]

    db = get_client()
    try:
        auth_response = db.auth.get_user(token)
    except Exception as e:
        logger.warning("Token verification failed: %s", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if not auth_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = auth_response.user.id
    result = (
        db.from_("users")
        .select("level,market,track,language")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User profile not found")

    d = result.data
    return AuthUser(
        id=user_id,
        level=d.get("level", 1),
        market=d.get("market", "india"),
        track=d.get("track", "tradr"),
        language=d.get("language", "python"),
    )
