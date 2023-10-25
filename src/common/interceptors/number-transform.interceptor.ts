import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NumberTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transformData(data);
      }),
    );
  }

  private transformData(data: any): any {
    // Transform specific fields
    if (data && typeof data.capacity === 'string') {
      data.capacity = parseInt(data.capacity, 10);
    }

    // Add more transformations as needed

    return data;
  }
}
