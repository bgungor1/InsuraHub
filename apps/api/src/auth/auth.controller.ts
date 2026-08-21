import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { CurrentUser, Roles } from './decorators';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard, RolesGuard } from './guards';
import type { AuthenticatedUser } from './strategies';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('Authentication', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 8 * 60 * 60 * 1000,
      path: '/',
    });

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    response.clearCookie('Authentication', {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    return { message: 'Başarıyla çıkış yapıldı' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('userId') userId: string) {
    const user = await this.authService.getProfile(userId);
    return {
      message: 'Profil bilgileri başarıyla getirildi',
      user,
    };
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY_USER)
  adminOnlyTest(@CurrentUser() user: AuthenticatedUser) {
    return {
      message:
        'Rol ve güvenlik duvarı başarıyla aşıldı! Bu alana sadece yetkili yöneticiler girebilir.',
      user,
    };
  }
}
