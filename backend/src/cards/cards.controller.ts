import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Put,
  Delete,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

/**
 * CardsController - 受保护路由（需要 JWT）
 * 路径： /api/cards/*
 */
@UseGuards(JwtAuthGuard)
@Controller('api/cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly usersService: UsersService, // 用于查 owner
  ) {}

  // 创建卡片
  @Post()
  async create(@Req() req: any, @Body() dto: CreateCardDto) {
    const userId = req.userId as number;
    const user = await this.usersService.findById(userId);
    return this.cardsService.create(user as any, dto);
  }

  // 分页获取用户卡片
  @Get()
  async list(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('pageSize', new DefaultValuePipe(20)) pageSize: number,
  ) {
    const userId = req.userId as number;
    return this.cardsService.listByUser(userId, Number(page), Number(pageSize));
  }

  // 获取单张卡片
  @Get(':id')
  async get(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const card = await this.cardsService.findById(id);
    // 权限校验
    if (card.owner.id !== req.userId) return { error: 'forbidden' };
    return card;
  }

  // 更新卡片
  @Put(':id')
  async update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCardDto) {
    const userId = req.userId as number;
    return this.cardsService.update(userId, id, dto);
  }

  // 删除卡片
  @Delete(':id')
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const userId = req.userId as number;
    await this.cardsService.remove(userId, id);
    return { success: true };
  }

  // 获取到期卡片（供 Review 页面调用）
  @Get('/due/list')
  async dueList(@Req() req: any, @Query('limit', new DefaultValuePipe(50)) limit: number) {
    const userId = req.userId as number;
    const cards = await this.cardsService.findDueCards(userId, Number(limit));
    // 返回给前端的最好剔除 owner.passwordHash 等敏感字段
    return cards.map(c => ({
      id: c.id,
      question: c.question,
      answer: c.answer,
      tags: c.tags,
      difficulty: c.difficulty,
      ef: c.ef,
      repetition: c.repetition,
      interval: c.interval,
      nextReviewAt: c.nextReviewAt,
    }));
  }
}
