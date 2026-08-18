import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PoliciesModule } from './policies/policies.module';
import { FinanceModule } from './finance/finance.module';
import { TicketsModule } from './tickets/tickets.module';
import { CompaniesModule } from './domains/companies/companies.module';
import { AgenciesModule } from './domains/agencies/agencies.module';
import { BranchesModule } from './domains/branches/branches.module';
import { UsersModule } from './domains/users/users.module';

function validateEnv(config: Record<string, unknown>) {
  if (!config.DATABASE_URL) {
    throw new Error('❌ Environment variable validation error: DATABASE_URL is required!');
  }
  if (!config.JWT_SECRET) {
    throw new Error('❌ Environment variable validation error: JWT_SECRET is required!');
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
    PoliciesModule,
    FinanceModule,
    TicketsModule,
    CompaniesModule,
    AgenciesModule,
    BranchesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}