from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from typing import Dict
import time

class SessionTimeoutMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: FastAPI,
        timeout_minutes: int = 15,
        excluded_paths: list = None
    ):
        super().__init__(app)
        self.timeout_minutes = timeout_minutes
        self.sessions: Dict[str, float] = {}
        self.excluded_paths = excluded_paths or ['/health', '/metrics']

    async def dispatch(self, request: Request, call_next):
        # Skip middleware for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)

        # Get session ID from auth header or cookie
        session_id = request.headers.get('Authorization') or request.cookies.get('session')
        
        if not session_id:
            raise HTTPException(status_code=401, detail="No session found")

        # Check if session exists and hasn't timed out
        last_activity = self.sessions.get(session_id)
        current_time = time.time()

        if not last_activity:
            raise HTTPException(status_code=401, detail="Session expired")

        if current_time - last_activity > self.timeout_minutes * 60:
            # Remove expired session
            self.sessions.pop(session_id, None)
            raise HTTPException(status_code=401, detail="Session timeout")

        # Update last activity time
        self.sessions[session_id] = current_time

        # Add session info to request state
        request.state.session_id = session_id
        request.state.last_activity = datetime.fromtimestamp(last_activity)

        response = await call_next(request)
        return response

def setup_session_middleware(app: FastAPI, timeout_minutes: int = 15):
    """Add session timeout middleware to FastAPI app."""
    app.add_middleware(
        SessionTimeoutMiddleware,
        timeout_minutes=timeout_minutes
    ) 