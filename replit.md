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

**Edge Functions**: Serverless functions deployed on Supabase Edge Functions (Deno runtime).

**Sentiment Analysis Function** (`analyze-sentiment`):
- Processes text input and returns sentiment classification
- Uses Hugging Face Inference API with DistilBERT model
- Handles rate limiting and model loading states
- Returns sentiment (positive/negative/neutral), confidence score, and explanation

**Image Analysis Function** (`analyze-image`):
- Processes image uploads and extracts text/captions
- Uses Hugging Face Vision-GPT2 model for image captioning
- Handles base64 image encoding/decoding
- Includes retry logic for model loading delays

**Error Handling**: Comprehensive error handling with user-friendly messages, including specific handling for API rate limits (429) and service unavailability (503).

**CORS Configuration**: All edge functions include proper CORS headers for cross-origin requests.

### Design Patterns

**Component Composition**: Heavy use of composition pattern with shadcn/ui components, allowing flexible and reusable UI elements.

**Separation of Concerns**: Clear separation between presentation components (UI), business logic (hooks), and API communication (edge functions).

**Type Safety**: Full TypeScript implementation across frontend with strict type checking disabled for development flexibility but maintaining type definitions for external APIs.

**Responsive Design**: Mobile-first approach with responsive breakpoints and mobile-specific hooks (`use-mobile`).

**Accessibility**: Built on Radix UI primitives ensuring ARIA compliance and keyboard navigation support.

## External Dependencies

### Third-Party Services

**Supabase**: Backend-as-a-Service platform providing:
- Edge Functions hosting (Deno runtime)
- Client SDK for API communication
- Authentication infrastructure (configured but not actively used)
- Environment configuration management

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