# DigitalShepard Frontend

A modern, responsive frontend for the DigitalShepard cyber security platform, built with Next.js 14, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Modern UI with dark/light theme support
- 📱 Fully responsive design
- 🚀 Fast page loads with Next.js 14
- 🎭 Beautiful animations with Framer Motion
- 🎯 Type-safe with TypeScript
- 🎨 Consistent design system with shadcn/ui
- 🔍 Real-time threat detection
- 🏆 Achievement tracking
- 🐳 Dockerized deployment

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Docker and Docker Compose (for containerized deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/digitalshepherd.git
   cd digitalshepherd/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Development

Run the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t digitalshepherd-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 digitalshepherd-frontend
   ```

Or use Docker Compose:

```bash
docker-compose up -d frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   └── sections/    # Page sections
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 