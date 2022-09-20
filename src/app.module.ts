import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { BossraidModule } from './api/bossraid/bossraid.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: 3306,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/api/**/*.entity.*'],
      charset: 'utf8mb4',
      synchronize: true,
      logging: true,
    }),
    UserModule,
    BossraidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
