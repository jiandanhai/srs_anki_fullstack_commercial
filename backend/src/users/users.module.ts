// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Card } from '../cards/entities/card.entity';

@Module({
  imports: [
    // TypeOrmModule.forFeature 会自动提供 UserRepository 和 CardRepository
    TypeOrmModule.forFeature([User, Card]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 如果其他模块也需要 UsersService
})
export class UsersModule {}
