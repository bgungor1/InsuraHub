import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { PoliciesGateway } from './policies.gateway';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuditLogsModule, NotificationsModule],
  controllers: [PoliciesController],
  providers: [PoliciesService, PoliciesGateway],
  exports: [PoliciesService, PoliciesGateway],
})
export class PoliciesModule {}
