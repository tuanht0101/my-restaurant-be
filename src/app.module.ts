import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    OrderModule,
    MenuModule,
    MenuItemModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
