import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: '/policies',
})
export class PoliciesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PoliciesGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Policies WebSocket Gateway başlatıldı.');
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client bağlandı: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client ayrıldı: ${client.id}`);
  }

  broadcastPolicyCreated(payload: {
    policyId: string;
    product: string;
    branchId: string;
  }) {
    this.server?.emit('policy_created', payload);
  }

  broadcastPolicyClaimed(policyId: string, brokerId: string) {
    this.server?.emit('policy_claimed', { policyId, brokerId });
  }

  broadcastPolicyReleased(policyId: string) {
    this.server?.emit('policy_released', { policyId });
  }

  broadcastPolicyCompleted(policyId: string) {
    this.server?.emit('policy_completed', { policyId });
  }
}
