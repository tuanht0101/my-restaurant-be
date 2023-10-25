import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BooleanTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transformBooleans(data);
      }),
    );
  }

  private transformBooleans(data: any): any {
    if (typeof data === 'object') {
      // If the data is an object, transform boolean strings to booleans
      for (const key in data) {
        if (
          typeof data[key] === 'string' &&
          ['true', 'false'].includes(data[key].toLowerCase())
        ) {
          data[key] = data[key].toLowerCase() === 'true';
        } else if (typeof data[key] === 'object') {
          data[key] = this.transformBooleans(data[key]); // Recursively transform nested objects
        }
      }
    }
    return data;
  }
}
