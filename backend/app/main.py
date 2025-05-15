from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.api import api_router
from .middleware.rate_limiter import setup_rate_limiter
from .middleware.session import setup_session_middleware
from prometheus_client import make_asgi_app
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

app = FastAPI(
    title="Digital Shepherd API",
    description="Cybersecurity monitoring and education platform",
    version="1.0.0"
)

# Setup monitoring
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Initialize Sentry (if SENTRY_DSN is set)
if sentry_dsn := app.state.settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
    app.add_middleware(SentryAsgiMiddleware)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add production origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup rate limiting
limiter = setup_rate_limiter(app)

# Setup session timeout (15 minutes)
setup_session_middleware(app, timeout_minutes=15)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Digital Shepherd API",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    } 