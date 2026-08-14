import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser, Roles } from './decorators';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, RolesGuard } from './guards';
import type { JwtPayload } from './strategies';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@CurrentUser() user: JwtPayload) {
        return {
            message: 'Profil bilgileri başarıyla getirildi',
            user,
        };
    }

    @Get('admin-only')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.COMPANY_USER)
    adminOnlyTest(@CurrentUser() user: JwtPayload) {
        return {
            message: 'Rol ve güvenlik duvarı başarıyla aşıldı! Bu alana sadece yetkili yöneticiler girebilir.',
            user,
        };
    }
}