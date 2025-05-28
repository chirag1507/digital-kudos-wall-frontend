# Digital Kudos Wall - Frontend

React web application for the Digital Kudos Wall project.

## Overview

This is the frontend component of the Digital Kudos Wall system, built with React and TypeScript. It provides the user interface for Tech Leads to give kudos and for all users to view the kudos wall.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Jest** for unit testing
- **React Testing Library** for component testing
- **ESLint** and **Prettier** for code quality
- **Docker** for containerization

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## Testing Strategy

Following TDD principles with multiple test layers:

- **Unit Tests**: Individual component and function testing
- **Component Tests**: React component integration testing
- **Contract Tests**: API contract verification
- **Linting**: Code quality and style enforcement

## CI/CD Pipeline

This repository includes a GitHub Actions workflow that implements the **Commit Stage** of our pipeline:

1. **Code Checkout**
2. **Dependency Installation**
3. **Code Compilation** (TypeScript)
4. **Unit Tests**
5. **Component Tests**
6. **Linting & Code Analysis**
7. **Build Application**
8. **Docker Image Creation**
9. **Image Publishing** to GitHub Container Registry

## Docker

The application is containerized for consistent deployment across environments.

```bash
# Build Docker image
docker build -t digital-kudos-wall-frontend .

# Run container
docker run -p 3000:3000 digital-kudos-wall-frontend
```

## Contributing

This project follows:

- **Trunk-based development**
- **Small, frequent commits**
- **Test-driven development**
- **Continuous integration**

## Links

- [Main Project Repository](https://github.com/chirag1507/digital-kudos-wall)
- [Backend Repository](https://github.com/chirag1507/digital-kudos-wall-backend)
- [System Tests Repository](https://github.com/chirag1507/digital-kudos-wall-system-tests)
