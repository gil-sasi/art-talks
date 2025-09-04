# Art Talks WebSocket Server

Professional Node.js WebSocket server for real-time art discussion chat.

## Features

- **Room-based Chat**: Each artwork has separate discussion rooms
- **Real-time Messaging**: Instant message broadcasting to all connected clients
- **AI Art Critics**: Intelligent responses from simulated art experts
- **Typing Indicators**: Real-time typing status across clients
- **Connection Management**: Automatic room cleanup and error handling
- **Scalable Architecture**: Production-ready WebSocket implementation

## Installation

```bash
cd server
npm install
```

## Development

```bash
# Start server with auto-restart
npm run dev

# Start server (production)
npm start
```

## API

### WebSocket Endpoint
```
ws://localhost:8080/chat/{artworkId}
```

### Message Format
```json
{
  "type": "message|typing|stop_typing",
  "data": {
    "text": "Message content",
    "isOwnMessage": true
  },
  "sender": "Username",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Architecture

```
Frontend (React) ←→ WebSocket Server (Node.js) ←→ Multiple Clients
```

- **Rooms**: Each artwork discussion is isolated
- **Broadcasting**: Messages sent to all users in the same room
- **AI Responses**: Simulated art critics provide intelligent feedback
- **Error Handling**: Graceful connection management and cleanup

## Production Deployment

The server is ready for deployment to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

Environment variables:
- `PORT`: Server port (default: 8080)
