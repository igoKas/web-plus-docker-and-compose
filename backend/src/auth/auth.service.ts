import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/common/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async auth(user: User) {
    const payload = { id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne({ where: { username }, select: { id: true, username: true, password: true } });
    if (!(user && (await comparePassword(pass, user.password)))) return null;
    const { password, ...result } = user;
    return result;
  }
}
