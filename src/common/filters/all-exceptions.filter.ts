import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown error';

    try {
      // Handle HTTP exceptions
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        
        if (typeof exceptionResponse === 'object') {
          message = (exceptionResponse as any).message || message;
          error = (exceptionResponse as any).error || error;
        } else {
          message = exceptionResponse as string;
        }
      } 
      // Handle TypeORM errors
      else if (exception instanceof TypeORMError) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        error = 'Database error';
      } 
      // Handle other errors
      else if (exception instanceof Error) {
        message = exception.message;
        error = exception.name;
      }

      // Log the error
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : 'No stack trace',
      );

      // Send response but don't crash the application
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
        message,
      });
    } catch (err) {
      // If error handling itself fails, log it and return a generic error
      this.logger.error(`Error in exception filter: ${err.message}`, err.stack);
      
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    }
  }
}
