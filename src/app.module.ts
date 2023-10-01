import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { BillModule } from './bill/bill.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TableModule } from './table/table.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    CategoryModule,
    ProductModule,
    BillModule,
    DashboardModule,
    TableModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
