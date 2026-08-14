import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] | Record<string, unknown> = 'Sunucu tarafında beklenmeyen bir hata oluştu.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const respObj = exceptionResponse as Record<string, unknown>;
        message = (respObj.message as string | string[]) || respObj;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma Unique Constraint Hataları (P2002)
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = `Bu kayıt zaten mevcut (${(exception.meta?.target as string[])?.join(', ') || 'Benzersiz alan ihlali'}).`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'İstenen kayıt bulunamadı.';
      }
    } else {
      // Beklenmeyen 500 hatalarını sunucu konsoluna bas
      this.logger.error(
        `[Uncaught Exception] ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}