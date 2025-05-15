#################################
# Stage 1: Builder
#################################
FROM python:3.12.8-slim AS builder
WORKDIR /app

# Install OS tools + Python build backends
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    python3-dev \
    python3-setuptools \
    python3-wheel \
 && rm -rf /var/lib/apt/lists/*

# Copy & install Python deps
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy source code
COPY . .

#################################
# Stage 2: Production
#################################
FROM python:3.12.8-slim AS production
WORKDIR /app

# Only need the Postgres client at runtime
RUN apt-get update \
 && apt-get install -y --no-install-recommends libpq-dev \
 && rm -rf /var/lib/apt/lists/*

# Copy installed packages & app code from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app /app

# Create non-root user
RUN useradd -m -u 1000 appuser \
 && chown -R appuser:appuser /app
USER appuser

# Expose and run
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
