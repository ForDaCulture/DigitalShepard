from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.api import api_router
from .middleware.rate_limiter import setup_rate_limiter
from .middleware.session import setup_session_middleware
from prometheus_client import make_asgi_app
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from .core.settings import get_settings

# Initialize settings
settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Cybersecurity monitoring and education platform",
    version="1.0.0"
)

# Store settings in app state
app.state.settings = settings

# Setup monitoring
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Initialize Sentry (if SENTRY_DSN is set)
if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
    )
    app.add_middleware(SentryAsgiMiddleware)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup rate limiting
limiter = setup_rate_limiter(app)

# Setup session timeout
setup_session_middleware(app, timeout_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    } 