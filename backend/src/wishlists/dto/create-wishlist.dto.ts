import { PickType } from "@nestjs/swagger";
import { Wishlist } from "../entities/wishlist.entity";
import { IsArray, IsNotEmpty } from "class-validator";

export class CreateWishlistDto extends PickType(Wishlist, [
  "name",
  "image",
] as const) {
  @IsNotEmpty()
  @IsArray()
  itemsId: number[];
}
