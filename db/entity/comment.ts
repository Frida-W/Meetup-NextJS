import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import {Article} from "./article"

@Entity({ name: "comments" }) 
export class Comment extends BaseEntity { 
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column("text", { nullable: false })
  content!: string;

  @Column("datetime", { nullable: true })
  create_time: Date| undefined;

  @Column("datetime", { nullable: true })
  update_time: Date| undefined;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User | undefined; 

  @ManyToOne(() => Article)
  @JoinColumn({ name: "article_id" })
  article: Article | undefined; 
}
