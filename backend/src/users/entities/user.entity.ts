import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MinLength, ValidateIf } from "class-validator";
import { BaseEntity } from "../../common/entities/base.entity";
import { Entity, Column, OneToMany } from "typeorm";
import { Offer } from "src/offers/entities/offer.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, length: 64 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе', length: 200 })
  @ValidateIf(o => !!o.about)
  @IsString()
  @Length(1, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsString()
  @IsUrl()
  avatar: string;

  @Column({ unique: true, select: false })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
