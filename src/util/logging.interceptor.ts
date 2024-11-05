import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    Logger.log(`request : ${method} / ${url} ${JSON.stringify(request.body)}`);

    return next.handle().pipe(
      tap((response) => {
        Logger.log(
          `response : ${method} / ${url} ${Date.now() - now}ms ${JSON.stringify(response)}`,
        );
      }),
    );
  }
}
