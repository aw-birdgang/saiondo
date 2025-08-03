# WebSocket Service

This directory contains the WebSocket service implementation for the React Web application.

## Files

- `WebSocketService.ts` - Main WebSocket service class with connection management, message handling, and automatic reconnection
- `EventEmitter.ts` - Browser-compatible EventEmitter implementation (replaces Node.js 'events' module)

## EventEmitter

The `EventEmitter` class is a custom implementation that provides the same API as Node.js EventEmitter but is compatible with browser environments. This was created to resolve Vite's browser compatibility issues with Node.js modules.

### Features

- Event listening with `on()`
- Event emission with `emit()`
- Event removal with `off()`
- One-time event listeners with `once()`
- Listener count with `listenerCount()`
- Remove all listeners with `removeAllListeners()`

## WebSocketService

The WebSocket service provides:

- Automatic connection management
- Message sending and receiving
- Channel subscription/unsubscription
- Typing indicators
- Automatic reconnection with exponential backoff
- Heartbeat mechanism
- Error handling and user notifications

## Usage

```typescript
import { initializeWebSocket, getWebSocketService } from './WebSocketService';

// Initialize the service
const wsService = initializeWebSocket({
  url: 'wss://your-websocket-server.com',
  token: 'your-auth-token',
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});

// Listen to events
wsService.on('message', (data) => {
  console.log('Received message:', data);
});

wsService.on('connected', () => {
  console.log('WebSocket connected');
});

// Send messages
wsService.send({
  type: 'message',
  data: { text: 'Hello world' },
  timestamp: Date.now()
});
``` 