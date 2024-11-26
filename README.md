# AI ChatBot Application

A modern, feature-rich chatbot application built with Next.js, React, and TypeScript. The application supports file uploads, multiple AI models, and temperature-based response generation.

## Evidence screens
![alt text](https://raw.githubusercontent.com/manojreddyvanga/chatbot-next-js-web/refs/heads/master/evidence/image.png)

## Features

- 🤖 Multiple AI model support (GPT-3.5, GPT-4, Claude-2)
- 📁 File upload and processing (Doc, JSON, PDF, TXT)
- 🌡️ Adjustable temperature for response generation
- 🎨 Light/Dark theme support
- 🔒 JWT Authentication
- 📱 Responsive design
- 🧪 Comprehensive test coverage
- 🐳 Docker support
- 🔄 CI/CD pipeline

## Architecture Decisions

1. **Framework**: Next.js 13+ with App Router
   - Server-side rendering capabilities
   - Built-in API routes
   - Optimized performance

2. **UI Components**: shadcn/ui + Tailwind CSS
   - Consistent design system
   - Highly customizable
   - Accessible components

3. **Authentication**: JWT + Next.js Middleware
   - Stateless authentication
   - Secure token management
   - Easy integration with API routes

4. **Testing**:
   - Jest + React Testing Library
   - Component-level unit tests
   - Integration tests for critical flows

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables: ( add .env in the root path )
   ```
   JWT_SECRET=your-secret-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Docker

Build the image:
```bash
docker build -t chatbot-app .
```

Run the container:
```bash
docker run -p 3000:3000 chatbot-app
```

## Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

## CI/CD

The application uses GitHub Actions for:
- Running tests
- Building the application
- Building and pushing Docker images

## Architecture Overview

```
├── app/                 # Next.js 13 app directory
├── components/          # React components
├── lib/                # Utility functions
├── __tests__/          # Test files
├── public/             # Static assets
└── types/              # TypeScript types
```

## Working Snippets 
For both Light/Dark theme along with performance snippets - see the folder - Evidence in root of the application 

## Working data 
Used chatbot_testing_data to testing. 
