import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import path from 'path';
import { timestamp } from 'rxjs';
import { Http } from 'winston/lib/winston/transports';

@Catch()
export class AllExceptionFilterFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let validationError = [];
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        validationError = Array.isArray(exceptionResponse['message'])
          ? exceptionResponse['message']
          : [exceptionResponse['message']];
      }
    }
    const logMessage = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      body: request.body,
      validationError,
    };

    Logger.error(
      `Validation Error - ${JSON.stringify(logMessage, null, 2)}`,
      'validateion error',
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof Error ? exception.message : 'unknown exception',
    });
  }
}
