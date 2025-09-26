import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../cards/entities/card.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { UsersModule } from '../users/users.module'; // 导入 UsersModule
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
    
  imports: [UsersModule,TypeOrmModule.forFeature([Card])],
  providers: [ReviewService,JwtAuthGuard],
  controllers: [ReviewController],
})
export class ReviewModule {}
