import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateUserDto } from './dto/update-user.dto';
import profileSelect from 'src/common/selects/profile.select';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) { }

  @Get('me')
  findOwn(@AuthUser() user: User) {
    return this.usersService.findOne({ where: { id: user.id }, select: profileSelect() });
  }

  @Patch('me')
  updateOwn(@AuthUser() user: User, @Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, UpdateUserDto);
  }

  @Get('me/wishes')
  findOwnWishes(@AuthUser() user: User) {
    return this.wishesService.findMany({ where: { owner: { id: user.id } } });
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findOne({ where: { username } });
  }

  @Get(':username/wishes')
  findWishesByUsername(@Param('username') username: string) {
    return this.wishesService.findMany({ where: { owner: { username } } });
  }

  @Post('find')
  findMany(@Body() body) {
    return this.usersService.findMany({
      where: [
        { username: body.query },
        { email: body.query }
      ],
      select: profileSelect()
    });
  }
}
