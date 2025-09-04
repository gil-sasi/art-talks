# Art Talks - Professional Setup Guide

## 🏗️ Architecture

This is a **full-stack application** with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js WebSocket Server
- **Real-time Communication**: WebSockets for instant messaging
- **Room-based Chat**: Each artwork has separate discussions

## 🚀 Quick Start

### Option 1: Run Everything at Once
```bash
# Install all dependencies (frontend + server)
npm run install:all

# Start both frontend and server simultaneously
npm run start:all
```

### Option 2: Run Separately (for development)

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

## 📡 Server Details

- **WebSocket Server**: `ws://localhost:8080`
- **Room-based**: Each artwork gets separate chat room
- **AI Critics**: Intelligent art discussion responses
- **Real-time**: Instant message broadcasting
- **Production Ready**: Proper error handling, graceful shutdown

## 🎯 For Recruiters

This demonstrates:

### **Full-Stack Architecture**
- ✅ Separation of concerns (Frontend/Backend)
- ✅ RESTful-like WebSocket API design
- ✅ Professional project structure

### **Frontend Best Practices**
- ✅ TypeScript with strict typing
- ✅ Custom React hooks for reusable logic
- ✅ Component composition patterns
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Responsive design
- ✅ Error boundaries and loading states

### **Backend Best Practices**
- ✅ WebSocket server with room management
- ✅ Connection lifecycle handling
- ✅ Error handling and graceful shutdown
- ✅ Scalable architecture (can handle multiple rooms/users)
- ✅ Environment configuration
- ✅ Production deployment ready

### **Real-time Features**
- ✅ Instant messaging across multiple clients
- ✅ Typing indicators
- ✅ Room-based isolation
- ✅ AI response simulation
- ✅ Connection status management

## 🧪 Testing Multi-User Chat

1. Start the application (`npm run start:all`)
2. Open multiple browser tabs to the same artwork discussion
3. Send messages in one tab → See them appear instantly in all tabs
4. AI critics will respond with art-related commentary
5. Typing indicators work across all connected clients

## 🌐 Production Deployment

### Server Deployment (Railway/Heroku/DigitalOcean)
```bash
cd server
npm install --production
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy 'dist' folder
```

### Environment Variables
- `PORT`: Server port (default: 8080)
- Update WebSocket URL in frontend for production

## 📋 Technology Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router
- Custom Hooks
- WebSocket Client

**Backend:**
- Node.js
- WebSocket Server (ws library)
- Room-based architecture
- AI response simulation

**Development:**
- ESLint
- Concurrent script execution
- Hot reloading (both frontend and backend)

This setup demonstrates **production-ready, scalable, real-time web application development** with modern best practices.
