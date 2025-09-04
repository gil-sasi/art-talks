import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketMessage {
  type: 'message' | 'user_joined' | 'user_left' | 'typing' | 'stop_typing';
  data: any;
  timestamp: string;
  sender?: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

/**
 * Custom hook for WebSocket connection management
 * 
 * EXPLANATION:
 * - Manages WebSocket lifecycle (connect, disconnect, reconnect)
 * - Handles message sending/receiving
 * - Provides connection status
 * - Auto-reconnection on connection loss
 */
export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000
  } = options;

  // Connection state management
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // WebSocket instance reference (persists across re-renders)
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Use refs for callbacks to avoid dependency issues
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  });

  /**
   * EXPLANATION: Connect to WebSocket server
   * - Creates new WebSocket instance
   * - Sets up event handlers for connection lifecycle
   * - Handles automatic reconnection logic
   */
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Create new WebSocket connection
      ws.current = new WebSocket(url);

      // Connection opened successfully
      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
        onConnect?.();
      };

      // Message received from server
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 Message received:', message);
          onMessage?.(message);
        } catch (err) {
          console.error('❌ Failed to parse WebSocket message:', err);
        }
      };

      // Connection closed
      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnect?.();

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Attempting reconnection ${reconnectAttempts.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      // Connection error
      ws.current.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('Connection failed');
        setIsConnecting(false);
        onError?.(event);
      };

    } catch (err) {
      console.error('❌ Failed to create WebSocket:', err);
      setError('Failed to connect');
      setIsConnecting(false);
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, autoReconnect, reconnectInterval]);

  /**
   * EXPLANATION: Send message through WebSocket
   * - Checks if connection is open
   * - Serializes message to JSON
   * - Sends to server
   */
  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const messageWithTimestamp: WebSocketMessage = {
        ...message,
        timestamp: new Date().toISOString()
      };
      
      ws.current.send(JSON.stringify(messageWithTimestamp));
      return true;
    } else {
      return false;
    }
  }, []);

  /**
   * EXPLANATION: Disconnect from WebSocket
   * - Closes connection gracefully
   * - Clears reconnection timeouts
   * - Resets connection state
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close(1000, 'User disconnected');
      ws.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttempts.current = 0;
  }, []);

  // Auto-connect on mount, disconnect on unmount
  useEffect(() => {
    // Connect immediately
    if (ws.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Create new WebSocket connection
      ws.current = new WebSocket(url);

      // Connection opened successfully
      ws.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
        onConnectRef.current?.();
      };

      // Message received from server
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessageRef.current?.(message);
        } catch (err) {
          // Failed to parse WebSocket message
        }
      };

      // Connection closed
      ws.current.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        onDisconnectRef.current?.();

        // Auto-reconnect logic
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            // Trigger reconnection by updating a state or calling connect again
            setIsConnecting(true);
          }, reconnectInterval);
        }
      };

      // Connection error
      ws.current.onerror = (event) => {
        setError('Connection failed');
        setIsConnecting(false);
        onErrorRef.current?.(event);
      };

    } catch (err) {
      setError('Failed to connect');
      setIsConnecting(false);
    }
    
    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (ws.current) {
        ws.current.close(1000, 'Component unmounted');
        ws.current = null;
      }
      
      setIsConnected(false);
      setIsConnecting(false);
      reconnectAttempts.current = 0;
    };
  }, [url, autoReconnect, reconnectInterval]); // Only depend on stable values

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    connect,
    disconnect
  };
};
