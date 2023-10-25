import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AtGuard } from './common/guards/at.guard';
import { BooleanTransformInterceptor } from './common/interceptors/boolean-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new BooleanTransformInterceptor());
  await app.listen(6868);
}
bootstrap();
