import { User } from "src/users/entities/user.entity";
import { BaseEntity } from "../../common/entities/base.entity";
import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { Offer } from "src/offers/entities/offer.entity";
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length, Min } from "class-validator";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";

@Entity()
export class Wish extends BaseEntity {
  @Column({ length: 250 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  raised: number;

  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @Column({ length: 1024 })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
