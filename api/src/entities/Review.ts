import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { Thread } from "./Thread";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  rating: number;

  @OneToMany(() => Thread, (thread) => thread.review)
  threads: Thread[];
}
