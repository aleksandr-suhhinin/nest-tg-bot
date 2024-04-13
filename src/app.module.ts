import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { TelegramModule } from './telegram/telegram.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TelegramModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'telegram_bot',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [AppService, UserService],
})
export class AppModule {}
