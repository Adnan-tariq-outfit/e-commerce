import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | string[];
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res.message as string | string[]) ?? exception.message;
        error = (res.error as string) ?? exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else if (this.isPrismaError(exception)) {
      const prisma = exception as { code: string };
      if (prisma.code === 'P2003' || prisma.code === 'P2014') {
        status = HttpStatus.CONFLICT;
        message =
          'Cannot delete this record because it is linked to existing orders or other data. Remove the related records first.';
        error = 'Conflict';
      } else if (prisma.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists.';
        error = 'Conflict';
      } else if (prisma.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found.';
        error = 'NotFound';
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'A database error occurred.';
        error = 'DatabaseError';
        this.logger.error(
          `Prisma error ${prisma.code} on ${request.method} ${request.url}`,
          exception instanceof Error ? exception.stack : String(exception),
        );
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'InternalServerError';
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private isPrismaError(exception: unknown): boolean {
    return (
      exception instanceof Error &&
      exception.constructor.name.startsWith('PrismaClient')
    );
  }
}
