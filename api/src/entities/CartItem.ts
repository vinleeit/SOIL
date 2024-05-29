import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class CartItem {
  @Column()
  @ManyToOne(() => User, (user) => user.cartItems)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  quantity: number;
}
