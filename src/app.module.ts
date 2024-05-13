/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET, 
      // signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }, 
      signOptions: { expiresIn: '60s' },
    }),
    AuthenticationModule,
    UsersModule,
    PostModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
