import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  /**
   * 提交复习结果
   * body: { cardId: number, grade: 0-5 }
   */
  @Post()
  async review(@Req() req: any, @Body() dto: ReviewDto) {
    const userId = req.userId as number;
    return this.reviewService.review(userId, dto);
  }
}
