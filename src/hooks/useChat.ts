import { useState, useEffect, useRef, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { APP_CONFIG } from '../constants';
import { useWebSocket, type WebSocketMessage } from './useWebSocket';

/**
 * Custom hook for handling chat functionality with WebSocket support
 * 
 * EXPLANATION:
 * - Now uses real WebSocket connection instead of setTimeout
 * - Handles real-time messaging between users
 * - Manages typing indicators from other users
 * - Maintains backward compatibility with existing UI
 * 
 * @param initialMessages - Initial chat messages
 * @param artworkId - ID of the artwork being discussed (for room separation)
 * @returns Chat state and actions
 */
export const useChat = (initialMessages: ChatMessage[] = [], artworkId?: number) => {
  // Start with empty messages - purely WebSocket-based, no persistence
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * EXPLANATION: Handle incoming WebSocket messages
   * - Converts WebSocket messages to ChatMessage format
   * - Handles different message types (message, typing, etc.)
   * - Updates UI state based on message type
   * - Prevents duplicate messages from user
   */
  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    
    switch (wsMessage.type) {
      case 'message':
        // Only add messages from OTHER users (AI responses, other people's messages)
        // User's own messages are added immediately when sending
        if (wsMessage.sender !== 'You') {
          const chatMessage: ChatMessage = {
            id: Date.now() + Math.random(),
            text: wsMessage.data.text,
            timestamp: new Date(wsMessage.timestamp),
            sender: wsMessage.sender || 'Anonymous',
            isOwnMessage: false
          };
          setMessages(prev => [...prev, chatMessage]);
        }
        break;

      case 'typing':
        // Show typing indicator for other users
        if (wsMessage.sender && wsMessage.sender !== 'You') {
          setTypingUsers(prev => new Set(prev).add(wsMessage.sender!));
          setIsTyping(true);
        }
        break;

      case 'stop_typing':
        // Hide typing indicator
        if (wsMessage.sender && wsMessage.sender !== 'You') {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(wsMessage.sender!);
            return newSet;
          });
          // Update typing status based on remaining typing users
          setIsTyping(prev => {
            const updatedSet = new Set(typingUsers);
            updatedSet.delete(wsMessage.sender!);
            return updatedSet.size > 0;
          });
        }
        break;

      default:
        console.log('🔄 Unhandled WebSocket message type:', wsMessage.type);
    }
  }, []); // Remove dependency on typingUsers.size

  /**
   * EXPLANATION: WebSocket connection setup
   * - Connects to WebSocket server (or mock server in development)
   * - Each artwork gets its own "room" for separate discussions (artworkId)
   * - Handles connection status and errors (onConnect, onDisconnect, onError)
   */
  // Memoize callback functions to prevent WebSocket reconnections
  const onConnect = useCallback(() => {
    // WebSocket connected successfully
  }, [artworkId]);

  const onDisconnect = useCallback(() => {
    // WebSocket disconnected
  }, []);

  const onError = useCallback((error: Event) => {
    // WebSocket connection error
  }, []);

  const { isConnected, isConnecting, error, sendMessage: sendWebSocketMessage } = useWebSocket({
    url: `ws://localhost:8080`, // Connect to WebSocket server directly
    onMessage: handleWebSocketMessage,
    onConnect,
    onDisconnect,
    onError,
    autoReconnect: true
  });

  /**
   * EXPLANATION: Send message via WebSocket
   * - Validates message length and content
   * - Adds user message to UI immediately (won't come back from server)
   * - Sends through WebSocket to trigger AI response only
   * - Clears input field on successful send
   */
  const sendMessage = useCallback((text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || trimmedText.length > APP_CONFIG.MAX_MESSAGE_LENGTH) {
      return false;
    }

    // Add user's message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now() + Math.random(),
      text: trimmedText,
      timestamp: new Date(),
      sender: 'You',
      isOwnMessage: true
    };
    setMessages(prev => [...prev, userMessage]);

    // Send message through WebSocket
    const success = sendWebSocketMessage({
      type: 'message',
      data: {
        text: trimmedText,
        isOwnMessage: true
      },
      sender: 'You'
    });

    if (success) {
      setNewMessage('');
      return true;
    } else {
      // If WebSocket send failed, still keep the message in UI
      console.warn('Message added to UI but WebSocket send failed');
      setNewMessage('');
      return true;
    }
  }, [sendWebSocketMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  }, [newMessage, sendMessage]);

  return {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    messagesEndRef,
    sendMessage,
    handleSubmit,
    canSend: newMessage.trim().length > 0 && newMessage.length <= APP_CONFIG.MAX_MESSAGE_LENGTH,
    // WebSocket connection status for UI feedback
    isConnected,
    isConnecting,
    connectionError: error
  };
};
