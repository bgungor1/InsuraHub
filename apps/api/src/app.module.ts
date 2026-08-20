import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';
import { CompaniesModule } from './domains/companies/companies.module';
import { AgenciesModule } from './domains/agencies/agencies.module';
import { BranchesModule } from './domains/branches/branches.module';
import { UsersModule } from './domains/users/users.module';
import { CustomersModule } from './domains/customers/customers.module';
import { PoliciesModule } from './domains/policies/policies.module';
import { CommissionsModule } from './domains/commissions/commissions.module';
import { DashboardModule } from './domains/dashboard/dashboard.module';
import { TicketsModule } from './domains/tickets/tickets.module';
import { AuditLogsModule } from './domains/audit-logs/audit-logs.module';
import { NotificationsModule } from './domains/notifications/notifications.module';

function validateEnv(config: Record<string, unknown>) {
  if (!config.DATABASE_URL) {
    throw new Error(
      '❌ Environment variable validation error: DATABASE_URL is required!',
    );
  }
  if (!config.JWT_SECRET) {
    throw new Error(
      '❌ Environment variable validation error: JWT_SECRET is required!',
    );
  }
  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    AgenciesModule,
    BranchesModule,
    CustomersModule,
    PoliciesModule,
    FinanceModule,
    TicketsModule,
    CommissionsModule,
    DashboardModule,
    AuditLogsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
