import { IsBoolean, IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseEntity } from "../../common/entities/base.entity";
import { Entity, Column, ManyToOne } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";

@Entity()
export class Offer extends BaseEntity {
  @Column()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
