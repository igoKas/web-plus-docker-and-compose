import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(user.id, createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true
      }
    })
  }

  @Patch(':id')
  update(@Param('id') wishlistId: number, @AuthUser() user: User, @Body() updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistsService.update(wishlistId, user.id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') wishlistId: number, @AuthUser() user: User) {
    return this.wishlistsService.remove(wishlistId, user.id);
  }
}
