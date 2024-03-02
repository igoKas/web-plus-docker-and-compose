import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  singin(@AuthUser() user: User) {
    return this.authService.auth(user);
  }

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    return user
  }
}
