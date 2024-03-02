import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private dataSource: DataSource
  ) {}
  async create(userId: number, createOfferDto: CreateOfferDto) {
    return this.dataSource.transaction(async manager => {
      const wish = await manager.findOneOrFail(
        Wish,
        { where: { id: createOfferDto.itemId }, relations: { owner: true } }
      );

      if (userId === wish.owner.id) {
        throw new ForbiddenException('Вы не можете вносить деньги на собственные подарки');
      }
      if (wish.raised + createOfferDto.amount > wish.price) {
        throw new BadRequestException(`Сумма взноса превышает сумму остатка стоимости подарка: ${wish.price - wish.raised}`);
      }

      await manager.update(Wish, createOfferDto.itemId, { raised: wish.raised + createOfferDto.amount });
      const offer = await manager.save(Offer, {
        amount: createOfferDto.amount,
        hidden: createOfferDto.hidden,
        user: { id: userId },
        item: { id: createOfferDto.itemId },
      });

      return offer;
    })
  }

  findAll() {
    return this.offersRepository.find({
      relations: {
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
    });
  }

  findOne(query) {
    return this.offersRepository.findOneOrFail(query);
  }
}
