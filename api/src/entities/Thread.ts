import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Review } from "./Review";

@Entity()
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Review, (review) => review.threads)
  @JoinColumn({ name: "reviewId" })
  review: Review;

  @Column()
  rootThreadId: number;

  @Column()
  parentThreadId: number;

  @Column()
  content: string;

  @Column()
  isRemoved: boolean;

  @Column()
  isBlocked: boolean;

  @Column()
  createdDateTime: Date;

  @Column()
  editedDateTime: Date;
}
