import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatsGateway {
  @SubscribeMessage('send-message')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    console.log(message); // Emit message to the connected client
    client.emit('message', message);
  }
}
