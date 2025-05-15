# 🛡️ Digital Shepherd

> An open-source cyber guardian platform that monitors, educates, and protects users in real time — built for students, freelancers, educators, and neurodivergent users.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Built With](https://img.shields.io/badge/stack-FastAPI%20%7C%20Next.js%20%7C%20Docker-blue)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)

## 🚀 Overview

**Digital Shepherd** is an AI-enhanced cybersecurity awareness platform that blends real-time threat detection with gamified learning. It helps users develop better security habits through:

- 🧠 ML-powered threat and fatigue detection
- 🎮 Gamified security education with XP and badges
- 📈 Real-time monitoring and visual feedback
- 🔐 Enterprise-grade security features

## 📦 Features

### 🛡️ Cyber Monitoring
- Anomaly detection using Isolation Forest ML
- Real-time behavior analysis and scoring
- Fatigue detection based on interaction patterns
- Visual threat indicators and actionable advice

### 🎮 Gamified Learning
- Dynamic XP system with level progression
- Achievement badges for security milestones
- Interactive timeline of security accomplishments
- Real-time feedback with animations and toasts

### 🔐 Security Features
- Nonce-based Content Security Policy (CSP)
- Rate limiting on sensitive endpoints
- 15-minute session timeout management
- CORS and XSS protection headers

### 📊 Monitoring & Analytics
- Prometheus metrics integration
- Sentry error tracking
- Performance monitoring
- User behavior analytics

## 🛠️ Getting Started

### Prerequisites

- Docker + Docker Compose v2.0+
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- PostgreSQL 14+ (if running without Docker)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/digital-shepherd.git
cd digital-shepherd

# Copy environment files
cp .env.example .env

# Build and start services
docker-compose up --build

# Access the applications:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
# Metrics: http://localhost:9090
```

### Local Development Setup

#### Backend (FastAPI)

```bash
# Setup Python environment
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000
```

#### Frontend (Next.js)

```bash
# Setup Node.js environment
cd frontend
npm install

# Run development server
npm run dev
```

## 📁 Project Structure

```
digital-shepherd/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   ├── core/
│   │   ├── middleware/
│   │   └── modules/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── achievements/
│   │   └── threats/
│   ├── components/
│   │   ├── security/
│   │   └── ui/
│   ├── lib/
│   │   └── contexts/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

The platform uses environment variables for configuration. Copy `.env.example` to `.env` and adjust the values:

```env
# Core settings
BACKEND_PORT=8000
NEXT_PUBLIC_API_URL=http://localhost:8000

# Security
SECRET_KEY=your-secret-key-here
SESSION_TIMEOUT_MINUTES=15

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📈 Monitoring

- **Prometheus Metrics**: Available at `/metrics`
- **Sentry Error Tracking**: Configured via `SENTRY_DSN`
- **API Documentation**: Available at `/docs`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

1. Code of Conduct
2. Development Process
3. Pull Request Guidelines
4. Security Guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- FastAPI for the robust API framework
- Next.js team for the frontend framework
- scikit-learn for ML capabilities
- All our contributors and supporters

---

Built with ❤️ by the Digital Shepherd Team 