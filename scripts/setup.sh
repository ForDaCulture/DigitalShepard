#!/bin/bash

# Text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🛡️ Setting up Digital Shepherd development environment...${NC}"

# Check Prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $2 is not installed${NC}"
        return 1
    fi
    return 0
}

# Verify required tools
REQUIREMENTS=(
    "docker:Docker"
    "node:Node.js"
    "python3:Python 3"
    "git:Git"
)

MISSING=()
for req in "${REQUIREMENTS[@]}"; do
    CMD="${req%%:*}"
    NAME="${req#*:}"
    if ! check_command "$CMD" "$NAME"; then
        MISSING+=("$NAME")
    fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required tools: ${MISSING[*]}${NC}"
    echo "Please install them and run this script again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
fi

# Setup Backend
echo -e "${BLUE}🔧 Setting up backend...${NC}"
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup Frontend
echo -e "${BLUE}🎨 Setting up frontend...${NC}"
cd frontend
npm install
cd ..

# Build Docker containers
echo -e "${BLUE}🐳 Building Docker containers...${NC}"
docker-compose build

echo -e "${GREEN}✅ Setup complete! Run 'docker-compose up' to start the application.${NC}"
echo -e "${YELLOW}
🌐 Access the applications at:
   Frontend: http://localhost:3000
   Backend API: http://localhost:8000/docs
   Metrics: http://localhost:9090

📚 Documentation:
   - README.md for general guidance
   - /docs for API documentation
   - /frontend/README.md for frontend details
${NC}" 