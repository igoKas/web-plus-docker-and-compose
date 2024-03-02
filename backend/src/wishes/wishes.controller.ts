import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(user.id, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findMany({ take: 40, order: { createdAt: 'DESC' } });
  }

  @Get('top')
  findTop() {
    return this.wishesService.findMany({ take: 20, order: { copied: 'DESC' } });
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: {
          user: {
            wishlists: {
              owner: true,
              items: true
            },
            wishes: true,
            offers: true,
          },
          item: true
        }
      }
    });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateOne(@Param('id') wishId: number, @AuthUser() user: User, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(wishId, user.id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  deleteOne(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.remove(wishId, user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copyOne(@Param('id') wishId: number, @AuthUser() user: User) {
    return this.wishesService.copy(wishId, user.id);
  }
}
