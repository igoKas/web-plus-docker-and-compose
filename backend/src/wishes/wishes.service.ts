import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) { }
  async create(owner: number, createWishDto: CreateWishDto) {
    return this.wishesRepository.save({ ...createWishDto, owner: { id: owner } });
  }

  async findMany(query) {
    return this.wishesRepository.find(query);
  }

  async findOne(query) {
    return this.wishesRepository.findOneOrFail(query);
  }

  async update(wishId: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOneOrFail({ where: { id: wishId }, relations: { owner: true, offers: true } });
    if (userId !== wish.owner.id) throw new ForbiddenException('Нельзя изменять чужие подарки');
    if (wish.offers.length && !!String(updateWishDto.price)) throw new BadRequestException('Нельзя изменять цену подарка, если есть офферы');
    return this.wishesRepository.update(wishId, updateWishDto);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOneOrFail({ where: { id: wishId }, relations: { owner: true, offers: true } });
    if (userId !== wish.owner.id || wish.offers.length) throw new ForbiddenException('Нельзя удалять чужие подарки и подарки с офферами');
    return this.wishesRepository.delete(wishId);
  }

  async copy(wishId: number, userId: number) {
    const copiedWish = await this.wishesRepository.findOneOrFail({
      where: { id: wishId },
      select: { name: true, description: true, link: true, image: true, price: true, copied: true },
    });
    if (userId === copiedWish.owner.id) throw new BadRequestException('Нельзя копировать свои подарки');
    copiedWish.copied++;
    return this.wishesRepository.save({ ...copiedWish, owner: { id: userId } });
  }
}
