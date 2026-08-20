import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  branchId?: string;
  agencyId?: string;
  companyId?: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  branchId?: string;
  agencyId?: string;
  companyId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is missing in configuration!');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.['Authentication'] || req?.cookies?.['token'];
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload) {
      throw new UnauthorizedException('Geçersiz token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      branchId: payload.branchId,
      agencyId: payload.agencyId,
      companyId: payload.companyId,
    };
  }
}
