# Art Talks - Interactive Art Gallery with Real-Time Chat

##  Project Overview

**Art Talks** is a modern, full-stack web application that combines an interactive art gallery with real-time chat functionality. Users can browse artworks and engage in live discussions about each piece, powered by WebSocket technology for instant communication.

###  Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js WebSocket Server
- **Real-time Communication**: WebSockets for instant messaging
- **Styling**: CSS3 with modern responsive design
- **Development Tools**: ESLint, TypeScript compiler, Concurrently

##  Quick Start

### Prerequisites
- Node.js (≥16.0.0)
- npm or yarn

### Installation & Running

**Option 1: Run Everything at Once**
```bash
# Install all dependencies (frontend + server)
npm run install:all

# Start both frontend and server simultaneously
npm run start:all
```

**Option 2: Run Separately (for development)**

**Terminal 1 - Start WebSocket Server:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **WebSocket Server**: ws://localhost:8080
- **API Endpoints**: http://localhost:8080/api/

## 📁 Project Structure

```
art-talks/
├── src/                          # Frontend source code
│   ├── components/               # React components (.tsx files)
│   │   ├── Gallery.tsx          # Main gallery grid view
│   │   ├── PictureDiscussion.tsx # Individual artwork chat page
│   │   ├── BackButton.tsx       # Navigation component
│   │   ├── Button.tsx           # Reusable button component
│   │   ├── ErrorBoundary.tsx    # Error handling wrapper
│   │   └── LoadingSpinner.tsx   # Loading state component
│   ├── hooks/                   # Custom React hooks (.ts files)
│   │   ├── useChat.ts          # Chat functionality with WebSocket
│   │   ├── useWebSocket.ts     # WebSocket connection management
│   │   ├── useArtAPI.ts        # Art data fetching logic
│   │   ├── useArtSearch.ts     # Search/filtering functionality
│   │   └── useImageMetadata.ts # Image analysis utilities
│   ├── services/               # API and external services
│   │   └── artService.ts       # Art data service layer
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Core interfaces and types
│   ├── constants/              # Application constants
│   │   └── index.ts           # Configuration and UI text
│   ├── data/                   # Static data
│   │   └── artData.ts         # Artwork database (mock data)
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main application component with routing
│   └── main.tsx               # Application entry point
├── server/                     # Backend WebSocket server
│   ├── server.js              # Main server file with WebSocket logic
│   └── package.json           # Server dependencies
├── public/                     # Static assets
└── package.json               # Frontend dependencies and scripts
```

## 🔧 Key Components Explained

### Frontend Components (.tsx files)

#### `App.tsx`
- **Purpose**: Main application component with routing setup
- **Features**: React Router configuration, error boundary wrapper
- **Routes**: 
  - `/` → Gallery view
  - `/discussion/:id` → Individual artwork discussion

#### `Gallery.tsx`
- **Purpose**: Main gallery page displaying artwork grid
- **Features**: 
  - Search functionality with real-time filtering
  - Responsive grid layout
  - Image metadata tooltips
  - Accessibility features (ARIA labels, keyboard navigation)
- **Hooks Used**: `useArtAPI`, `useArtSearch`, `useImageMetadata`

#### `PictureDiscussion.tsx`
- **Purpose**: Individual artwork view with real-time chat
- **Features**:
  - Artwork display with details
  - Real-time WebSocket chat
  - Typing indicators
  - Message history
  - Form validation
- **Hooks Used**: `useChat`, `useArtworkById`

#### `ErrorBoundary.tsx`
- **Purpose**: Catches and handles React component errors gracefully
- **Features**: Fallback UI when components crash

### Custom Hooks (.ts files)

#### `useWebSocket.ts`
- **Purpose**: Manages WebSocket connection lifecycle
- **Features**:
  - Auto-connection and reconnection logic
  - Message sending/receiving
  - Connection status tracking
  - Error handling
  - Cleanup on unmount

#### `useChat.ts`
- **Purpose**: Handles chat functionality with WebSocket integration
- **Features**:
  - Real-time messaging
  - Typing indicators
  - Message validation
  - Auto-scrolling to new messages
  - Integration with WebSocket hook

#### `useArtAPI.ts`
- **Purpose**: Manages artwork data fetching and caching
- **Features**:
  - API calls to server or local data
  - Loading states
  - Error handling
  - Individual artwork retrieval

#### `useArtSearch.ts`
- **Purpose**: Implements search and filtering logic
- **Features**:
  - Real-time search with debouncing
  - Multi-field filtering (title, artist, category)
  - Search result management

#### `useImageMetadata.ts`
- **Purpose**: Analyzes and displays image metadata
- **Features**:
  - Resolution detection
  - Aspect ratio calculation
  - Format identification

##  Backend Architecture

### `server/server.js`
- **Purpose**: WebSocket server handling real-time communication
- **Features**:
  - Room-based chat (each artwork has separate discussion)
  - AI response simulation
  - Message broadcasting
  - Connection management
  - RESTful API endpoints for artwork data
  - CORS handling
  - Graceful shutdown

##  Data Flow

### 1. Gallery View
```
User visits / → App.tsx → Gallery.tsx → useArtAPI → artService.ts → Display artworks
```

### 2. Search Functionality
```
User types in search → useArtSearch → Filter artworks → Update display
```

### 3. Chat Flow
```
User clicks artwork → Navigate to /discussion/:id → PictureDiscussion.tsx → 
useChat → useWebSocket → Connect to ws://localhost:8080 → Real-time messaging
```

### 4. Message Broadcasting
```
User sends message → WebSocket client → Server → AI response → 
Broadcast to all users in room → Update UI
```

##  Technology Deep Dive

### Frontend Technologies

#### React 19 + TypeScript
- **Why**: Type safety, component reusability, modern React features
- **Benefits**: Better development experience, fewer runtime errors

#### Vite
- **Why**: Fast development server, optimized builds
- **Benefits**: Hot module replacement, fast startup times

#### React Router
- **Why**: Client-side routing for single-page application
- **Usage**: Navigation between gallery and discussion views

### Backend Technologies

#### WebSocket (ws library)
- **Why**: Real-time bidirectional communication
- **Usage**: Instant messaging, typing indicators, live updates

#### Node.js HTTP Server
- **Why**: RESTful API endpoints, static file serving
- **Usage**: Artwork data API, CORS handling

##  Key Features for Interview Discussion

### 1. **Real-Time Communication**
- WebSocket implementation for instant messaging
- Room-based architecture (each artwork = separate chat room)
- Auto-reconnection logic for robust connections

### 2. **Modern React Patterns**
- Custom hooks for logic separation
- TypeScript for type safety
- Error boundaries for graceful error handling
- Proper state management with useState and useEffect

### 3. **Performance Optimizations**
- Image lazy loading
- Search debouncing
- Memoized callbacks to prevent unnecessary re-renders
- Efficient WebSocket message handling

### 4. **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure

### 5. **Code Organization**
- Clear separation of concerns
- Reusable components and hooks
- Type definitions in separate files
- Configuration management with constants

### 6. **Developer Experience**
- TypeScript for better IDE support
- ESLint for code quality
- Hot module replacement for fast development
- Concurrent script running for full-stack development

##  Code Quality Features

### TypeScript Integration
- Strict type checking
- Interface definitions for all data structures
- Generic types for reusable components
- Proper error handling with typed exceptions

### Error Handling
- Try-catch blocks in async operations
- React Error Boundaries for component crashes
- WebSocket connection error recovery
- User-friendly error messages

### Testing Considerations
- Components designed for easy testing
- Hooks separated for unit testing
- Mock data structure for development
- Clear function signatures for test assertions

##  Development Scripts

```bash
# Frontend Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Server Development  
npm run server       # Start production server
npm run server:dev   # Start development server with nodemon

# Full-Stack Development
npm run install:all  # Install all dependencies
npm run start:all    # Start both frontend and server
```

##  Deployment Considerations

### Frontend
- Static build output in `dist/` folder
- Can be deployed to any static hosting (Vercel, Netlify, S3)
- Environment variables for API endpoints

### Backend
- Node.js server deployment (Heroku, Railway, DigitalOcean)
- WebSocket support required
- Environment variables for port configuration

##  Interview Talking Points

### Technical Decisions
1. **Why WebSockets over HTTP polling**: Real-time requirements, better performance
2. **Why custom hooks**: Code reusability, logic separation, easier testing
3. **Why TypeScript**: Type safety, better developer experience, fewer bugs
4. **Why Vite over Create React App**: Faster development, modern tooling

### Scalability Considerations
1. **Database integration**: Easy to replace mock data with real database
2. **Authentication**: Prepared user types and structures
3. **Room management**: Server architecture supports multiple chat rooms
4. **State management**: Can easily integrate Redux or Zustand if needed

### Performance Features
1. **Image optimization**: Lazy loading, proper sizing
2. **Search optimization**: Debouncing, efficient filtering
3. **WebSocket efficiency**: Message batching, connection pooling ready
4. **Bundle optimization**: Vite's automatic code splitting

This README provides a comprehensive overview that demonstrates your understanding of modern web development practices, real-time communication, and professional code organization. Use it to confidently discuss the technical architecture and implementation decisions in your interview.