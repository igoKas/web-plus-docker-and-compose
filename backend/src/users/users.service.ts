import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/common/utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.save({
      ...createUserDto,
      password: await hashPassword(createUserDto.password)
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }
    const user = await this.usersRepository.update(id, updateUserDto);
    return user;
  }

  async findOne(query) {
    const user = await this.usersRepository.findOneOrFail(query);
    return user;
  }

  async findMany(query) {
    const user = await this.usersRepository.find(query);
    return user;
  }
}
