import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new UnauthorizedException('Kullanıcı kimliği doğrulanamadı veya yetkisiz istek.');
        }

        const hasRole = user.role === UserRole.SUPERADMIN || requiredRoles.includes(user.role);

        if (!hasRole) {
            throw new ForbiddenException('Bu işlemi yapmak için yetkiniz bulunmamaktadır.');
        }

        return true;
    }
}