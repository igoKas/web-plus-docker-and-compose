import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/configuration';
import { DatabaseConfig } from './config/database-config.factory';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      limit: 10,
      ttl: 60000,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig
    }),
    UsersModule,
    AuthModule,
    WishesModule,
    OffersModule,
    WishlistsModule
  ],
  providers: [
    { provide: 'APP_GUARD', useClass: ThrottlerGuard }
  ],
})
export class AppModule {}
