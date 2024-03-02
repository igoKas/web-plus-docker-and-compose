import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) { }
  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    return this.wishlistsRepository.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: { id: userId },
      items: createWishlistDto.itemsId.map(id => ({ id })),
    })
  }

  async findAll() {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true
      }
    })
  }

  async findOne(query) {
    return this.wishlistsRepository.findOneOrFail(query);
  }

  async update(wishlistId: number, userId: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistsRepository.findOneOrFail({ where: { id: wishlistId }, relations: { owner: true } });
    if (userId !== wishlist.owner.id) throw new ForbiddenException('Нельзя изменять чужие вишлисты');
    return this.wishlistsRepository.update(
      wishlistId,
      {
        name: updateWishlistDto.name,
        image: updateWishlistDto.image,
        items: updateWishlistDto.itemsId.map(id => ({ id })),
      }
    )
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOneOrFail({ where: { id: wishlistId }, relations: { owner: true } });
    if (userId !== wishlist.owner.id) throw new ForbiddenException('Нельзя удалять чужие вишлисты');
    return this.wishlistsRepository.delete(wishlistId);
  }
}
