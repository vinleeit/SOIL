import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { Review } from "./Review";
import { CartItem } from "./CartItem";

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  isBlocked: boolean;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];
}
