import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType();

		return next.handle().pipe(
			tap(() => {
				console.log(`[${requestType}] Request completed in ${Date.now() - recordTime}ms`);
			}),
		);
	}
}
