import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: true }) // Enable CORS for WebSocket connections
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedUsers: Map<string, string> = new Map(); // Map socket ID to user ID
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
      this.connectedUsers.delete(client.id); // Remove from connected users
    }
  
    // Listen for user registration
    @SubscribeMessage('register')
    handleRegister(
      @MessageBody() userId: string,
      @ConnectedSocket() client: Socket,
    ) {
      this.connectedUsers.set(client.id, userId); // Register user with their socket ID
      console.log(`User ${userId} registered with socket ${client.id}`);
    }
  
    // Notify a user
    notifyUser(userId: string, message: string) {
      const socketId = [...this.connectedUsers.entries()]
        .find(([_, id]) => id === userId)?.[0];
  
      if (socketId) {
        this.server.to(socketId).emit('notification', message);
        console.log(`Notified user ${userId}: ${message}`);
      }
    }
  
    // Notify all users
    notifyAll(message: string) {
      this.server.emit('notification', message);
      console.log(`Broadcasted notification: ${message}`);
    }
  }
  