import { PartialType, PickType } from "@nestjs/swagger";
import { Wish } from "../entities/wish.entity";


export class UpdateWishDto extends PartialType(
  PickType(Wish, ['description', 'price'] as const),
) {}