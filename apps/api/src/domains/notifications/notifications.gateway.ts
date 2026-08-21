import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Notifications WebSocket Gateway hazır.');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      void client.join(userId);
      this.logger.debug(`Kullanıcı (${userId}) bildirim kanalına katıldı.`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client ayrıldı: ${client.id}`);
  }

  @SubscribeMessage('join_user_channel')
  handleJoinUserChannel(client: Socket, userId: string) {
    if (userId) {
      void client.join(userId);
      this.logger.debug(`Kullanıcı (${userId}) bildirim odasına eklendi.`);
    }
  }

  sendNotificationToUser(userId: string, notification: unknown) {
    this.server?.to(userId).emit('new_notification', notification);
    this.server?.emit('notification_event', { userId, notification });
  }

  broadcast(event: string, payload: unknown) {
    this.server?.emit(event, payload);
  }
}
