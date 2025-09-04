const WebSocket = require('ws');
const http = require('http');
const url = require('url');

/**
 * Professional WebSocket Server for Art Talks
 * 
 * Features:
 * - Room-based chat (each artwork has separate discussion)
 * - Real-time message broadcasting
 * - AI response simulation
 * - Connection management
 * - Error handling
 * - Graceful shutdown
 */

const PORT = process.env.PORT || 8080;

// Create HTTP server with request handler
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API endpoint for art pieces
  if (req.method === 'GET' && parsedUrl.pathname === '/api/artworks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: ART_PIECES,
      count: ART_PIECES.length
    }));
    return;
  }
  
  // API endpoint for single artwork
  if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/artworks/')) {
    const artworkId = parseInt(parsedUrl.pathname.split('/').pop());
    const artwork = ART_PIECES.find(piece => piece.id === artworkId);
    
    if (artwork) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: artwork
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Artwork not found'
      }));
    }
    return;
  }
  
  // Default 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    error: 'Endpoint not found'
  }));
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server
  // Accept all WebSocket connections, handle room logic in message handler
});

// Store active connections by room
const rooms = new Map();

// AI responses for art discussions
const AI_RESPONSES = [
  "The brushwork in this piece shows incredible technique and emotional depth.",
  "I love how the artist uses light to create such a dramatic atmosphere.",
  "The color palette here is absolutely stunning - very harmonious composition.",
  "This reminds me of the impressionist movement, but with a modern twist.",
  "The way shadows and highlights interact creates such visual interest.",
  "There's something deeply contemplative about this artwork.",
  "The artist's use of texture adds so much dimension to the piece.",
  "This composition follows the rule of thirds beautifully.",
  "The emotional resonance of this work is quite powerful.",
  "I can almost feel the artist's passion in every brushstroke.",
  "The use of negative space here is particularly effective.",
  "This piece demonstrates masterful understanding of color theory.",
  "The perspective draws the viewer's eye beautifully through the composition.",
  "There's a wonderful sense of movement captured in this static medium.",
  "The artist's technique reminds me of the great masters."
];

const AI_CRITICS = ['ArtCritic', 'GalleryExpert', 'PaintingLover', 'ArtHistorian', 'CreativeEye', 'ColorMaster'];

// Hardcoded art pieces data
const ART_PIECES = [
  {
    id: 1,
    title: "Red Sunset",
    artist: "Emma Rodriguez",
    description: "A breathtaking sunset over mountain ranges, painted with vibrant reds and oranges that capture the essence of twilight.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    category: "landscape"
  },
  {
    id: 2,
    title: "Urban Symphony",
    artist: "Marcus Chen",
    description: "An abstract representation of city life, with bold geometric shapes and contrasting colors that reflect the energy of metropolitan areas.",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    category: "abstract"
  },
  {
    id: 3,
    title: "Ocean Dreams",
    artist: "Sofia Martinez",
    description: "A serene seascape capturing the gentle waves and endless horizon, painted in soothing blues and whites.",
    imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
    category: "landscape"
  },
  {
    id: 4,
    title: "Portrait of Grace",
    artist: "David Thompson",
    description: "A classical portrait showcasing masterful technique in capturing human emotion and character through oil painting.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&auto=format&q=80",
    category: "portrait"
  },
  {
    id: 5,
    title: "Forest Whispers",
    artist: "Luna Park",
    description: "A mystical forest scene with dappled sunlight filtering through ancient trees, creating an atmosphere of wonder and tranquility.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    category: "landscape"
  },
  {
    id: 6,
    title: "Digital Renaissance",
    artist: "Alex Kumar",
    description: "A modern interpretation of classical themes using digital art techniques, blending traditional composition with contemporary style.",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop&auto=format&q=80",
    category: "digital"
  },
  {
    id: 7,
    title: "Mountain Reflection",
    artist: "Isabella Romano",
    description: "A pristine alpine lake perfectly mirrors the towering peaks above, creating a symmetrical masterpiece of natural beauty.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80",
    category: "landscape"
  },
  {
    id: 8,
    title: "Cosmic Journey",
    artist: "Ryan Foster",
    description: "An otherworldly composition exploring space and time through swirling galaxies and celestial bodies in deep purples and golds.",
    imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=300&fit=crop",
    category: "abstract"
  },
  {
    id: 9,
    title: "Morning Mist",
    artist: "Catherine Williams",
    description: "A tranquil landscape capturing the ethereal beauty of dawn breaking through fog-covered hills and valleys.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop&auto=format&q=80",
    category: "landscape"
  },
  {
    id: 10,
    title: "City Lights",
    artist: "Michael Zhang",
    description: "An urban nightscape showcasing the vibrant energy of metropolitan life through neon reflections and architectural silhouettes.",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=300&fit=crop",
    category: "urban"
  },
  {
    id: 11,
    title: "Ancient Wisdom",
    artist: "Elena Petrov",
    description: "A contemplative portrait of an elderly figure, capturing decades of life experience in weathered features and knowing eyes.",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    category: "portrait"
  },
  {
    id: 12,
    title: "Peaceful Valley",
    artist: "James Patterson",
    description: "A serene valley landscape with gentle rolling hills, wildflowers, and a winding stream under a soft blue sky.",
    imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&h=300&fit=crop&auto=format&q=80",
    category: "landscape"
  },
  {
    id: 13,
    title: "Autumn Harvest",
    artist: "Sarah Mitchell",
    description: "A warm still life featuring seasonal fruits and vegetables arranged with rustic charm and golden lighting.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    category: "still-life"
  },
  {
    id: 14,
    title: "Golden Hour",
    artist: "Kevin Liu",
    description: "A warm landscape bathed in the soft golden light of sunset, with rolling hills and scattered trees creating perfect silhouettes.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format&q=80",
    category: "landscape"
  },
  {
    id: 15,
    title: "Stormy Seas",
    artist: "Maria Gonzalez",
    description: "A dramatic seascape capturing the raw power of nature with crashing waves and turbulent skies in moody blues and grays.",
    imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    category: "landscape"
  },
  {
    id: 16,
    title: "Inner Reflection",
    artist: "Thomas Anderson",
    description: "A psychological portrait exploring themes of identity and self-awareness through layered imagery and symbolic elements.",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
    category: "portrait"
  }
];

/**
 * Get or create room for artwork discussion
 */
function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  return rooms.get(roomId);
}

/**
 * Broadcast message to all clients in a room
 */
function broadcastToRoom(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const messageStr = JSON.stringify(message);
  
  room.forEach(ws => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(messageStr);
      } catch (error) {
        console.error('Error sending message to client:', error);
        room.delete(ws);
      }
    }
  });
}

/**
 * Generate AI response to user message
 */
function generateAIResponse(userMessage, roomId) {
  const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
  const critic = AI_CRITICS[Math.floor(Math.random() * AI_CRITICS.length)];
  
  // Send typing indicator first
  setTimeout(() => {
    broadcastToRoom(roomId, {
      type: 'typing',
      data: { isTyping: true },
      timestamp: new Date().toISOString(),
      sender: critic
    });
  }, 500);

  // Send actual response after delay
  setTimeout(() => {
    // Stop typing
    broadcastToRoom(roomId, {
      type: 'stop_typing',
      data: { isTyping: false },
      timestamp: new Date().toISOString(),
      sender: critic
    });

    // Send AI response
    broadcastToRoom(roomId, {
      type: 'message',
      data: {
        text: response,
        isOwnMessage: false
      },
      timestamp: new Date().toISOString(),
      sender: critic
    });
  }, 2000 + Math.random() * 1000); // 2-3 seconds delay
}

/**
 * Handle new WebSocket connections
 */
wss.on('connection', (ws, request) => {
  let currentRoom = null;
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Extract room from URL or message
      const url = new URL(request.url, `http://${request.headers.host}`);
      const roomId = url.pathname.split('/').pop() || 'general';
      
      // Add client to room if not already added
      if (currentRoom !== roomId) {
        if (currentRoom) {
          const oldRoom = rooms.get(currentRoom);
          if (oldRoom) oldRoom.delete(ws);
        }
        
        const room = getRoom(roomId);
        room.add(ws);
        currentRoom = roomId;
      }
      
      // Handle different message types
      switch (message.type) {
        case 'message':
          // Simply broadcast message to all other clients in the room
          // No AI responses - just real-time message sync
          broadcastToRoom(roomId, message, ws);
          break;
          
        case 'typing':
        case 'stop_typing':
          // Broadcast typing indicators to other clients
          broadcastToRoom(roomId, message, ws);
          break;
          
        default:
          // Unknown message type
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' },
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  ws.on('close', () => {
    // Remove client from room
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        room.delete(ws);
        
        // Clean up empty rooms
        if (room.size === 0) {
          rooms.delete(currentRoom);
        }
      }
    }
  });
  
  ws.on('error', (error) => {
    // WebSocket connection error
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    data: { message: 'Connected to Art Talks server' },
    timestamp: new Date().toISOString()
  }));
});

// Start server
server.listen(PORT, () => {
  console.log(`Art Talks Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/chat/{roomId}`);
  console.log(`API endpoints:`);
  console.log(`   GET http://localhost:${PORT}/api/artworks - Get all artworks`);
  console.log(`   GET http://localhost:${PORT}/api/artworks/{id} - Get single artwork`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  
  // Close all WebSocket connections
  wss.clients.forEach(ws => {
    ws.close(1001, 'Server shutting down');
  });
  
  server.close(() => {
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
