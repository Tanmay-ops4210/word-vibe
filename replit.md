# Sentiment Analysis Tool

## Overview

This is a web-based sentiment analysis application that uses AI to analyze the emotional tone of content from multiple sources including text, images, PDFs, and documents. The application is built using modern web technologies and provides real-time sentiment analysis with detailed confidence scores and explanations.

The tool is designed to be user-friendly, offering instant feedback on sentiment (positive, negative, or neutral) with visual representations of confidence levels. It supports multiple input methods including direct text entry and file uploads.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized builds.

**UI Component System**: The application uses shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable UI components. All components follow a consistent design system defined through CSS custom properties (HSL color scheme).

**Styling**: Tailwind CSS with custom configuration for design tokens. The design system includes predefined color schemes for sentiment visualization (positive, negative, neutral) and uses CSS variables for theming support.

**State Management**: React Query (@tanstack/react-query) for server state management and data fetching, with local state managed through React hooks.

**Routing**: React Router for client-side navigation with a catch-all 404 route handler.

**Key Components**:
- `SentimentAnalyzer`: Main analysis interface with text input
- `SentimentResult`: Visual display of analysis results with confidence metrics
- `FileUpload`: Handles multiple file format uploads (images, PDFs, documents)
- `HeroSection`: Marketing/informational header component

**Form Handling**: React Hook Form with Zod validation resolvers for type-safe form management.

### Backend Architecture

**Local Express Server**: Node.js Express backend server (port 3000) running on `server.js`.

**Database**: PostgreSQL database (Neon) with Drizzle ORM for data persistence:
- Connection pooling via `@neondatabase/serverless`
- Schema defined in `shared/schema.js`
- Database configuration in `server/db.js`
- Migrations handled via `drizzle-kit push`

**Data Model**: `sentiment_analyses` table storing:
- Unique ID (UUID)
- Input text and type (text/image/pdf/document)
- Sentiment classification (positive/negative/neutral)
- Confidence score (numeric)
- AI-generated explanation
- Optional filename and IP address
- Created timestamp

**Sentiment Analysis Endpoint** (`/api/analyze-sentiment`):
- Processes text input and returns sentiment classification
- Uses Hugging Face Inference API with DistilBERT model (`distilbert-base-uncased-finetuned-sst-2-english`)
- Handles rate limiting and model loading states
- Persists results to PostgreSQL database
- Returns sentiment (positive/negative/neutral), confidence score, and explanation

**Image Analysis Endpoint** (`/api/analyze-image`):
- Processes image uploads and extracts text/captions
- Uses Hugging Face Vision-GPT2 model for image captioning (`nlpconnect/vit-gpt2-image-captioning`)
- Handles base64 image encoding/decoding
- Includes retry logic for model loading delays

**Error Handling**: Comprehensive error handling with user-friendly messages, including specific handling for API rate limits (429) and service unavailability (503). Database errors properly propagate to clients.

**CORS Configuration**: All API endpoints include proper CORS headers for cross-origin requests.

**Vite Proxy**: Frontend Vite server (port 5000) proxies all `/api/*` requests to the backend server (port 3000) for seamless development experience.

### Design Patterns

**Component Composition**: Heavy use of composition pattern with shadcn/ui components, allowing flexible and reusable UI elements.

**Separation of Concerns**: Clear separation between presentation components (UI), business logic (hooks), and API communication (edge functions).

**Type Safety**: Full TypeScript implementation across frontend with strict type checking disabled for development flexibility but maintaining type definitions for external APIs.

**Responsive Design**: Mobile-first approach with responsive breakpoints and mobile-specific hooks (`use-mobile`).

**Accessibility**: Built on Radix UI primitives ensuring ARIA compliance and keyboard navigation support.

## External Dependencies

### Third-Party Services

**Neon PostgreSQL**: Serverless PostgreSQL database providing:
- Fully managed PostgreSQL database
- Connection pooling via `@neondatabase/serverless`
- WebSocket-based connections for serverless environments
- Integrated with Replit's database management

**Hugging Face Inference API**: AI/ML service providing:
- Sentiment analysis model: `distilbert-base-uncased-finetuned-sst-2-english`
- Image captioning model: `nlpconnect/vit-gpt2-image-captioning`
- Free tier API access (no API key currently used)

### UI Libraries

**Radix UI**: Comprehensive set of unstyled, accessible component primitives including:
- Dialog, Dropdown, Popover, Tooltip
- Accordion, Tabs, Navigation Menu
- Form controls (Checkbox, Radio, Select, Slider, Switch)
- Toast notifications

**shadcn/ui**: Pre-styled component library built on Radix UI with Tailwind CSS integration.

**Lucide React**: Icon library for consistent iconography throughout the application.

### Development Tools

**Vite**: Build tool and development server with hot module replacement.

**Tailwind CSS**: Utility-first CSS framework with PostCSS processing.

**TypeScript**: Type system with relaxed configuration for rapid development.

**ESLint**: Code linting with React-specific plugins.

**React Query**: Server state management with automatic caching and refetching.

### Additional Libraries

- `class-variance-authority`: For managing component variants
- `clsx` / `tailwind-merge`: Utility for conditional className merging
- `react-hook-form`: Form state management
- `zod`: Schema validation (via @hookform/resolvers)
- `date-fns`: Date manipulation utilities
- `embla-carousel-react`: Carousel component
- `next-themes`: Theme management (light/dark mode support)
- `sonner`: Toast notification system
- `vaul`: Drawer component library
- `drizzle-orm`: TypeScript ORM for PostgreSQL
- `drizzle-kit`: CLI tool for schema migrations
- `ws`: WebSocket library for Neon serverless connections

## Recent Changes (October 2025)

### Migration from Supabase to Neon PostgreSQL

**Date**: October 5, 2025

**Changes Made**:
1. Replaced Supabase with Neon PostgreSQL and Drizzle ORM
2. Migrated database schema from Supabase migrations to Drizzle schema
3. Converted Supabase Edge Functions to Express.js endpoints in `server.js`
4. Added database persistence for sentiment analysis results
5. Removed all Supabase dependencies and configuration files
6. Implemented proper error propagation for database operations

**New Database Setup**:
- Database schema: `shared/schema.js`
- Database connection: `server/db.js`
- Configuration: `drizzle.config.ts`
- Commands: `npm run db:push` (deploy schema), `npm run db:studio` (view data)

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (automatically configured by Replit)