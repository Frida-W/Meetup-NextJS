import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";

@Entity({ name: "articles" }) //"articles"是数据库表名，Article 是 实体类名
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column("varchar", { nullable: false })
  title!: string;

  @Column("varchar", { nullable: false })
  content!: string;

  @Column("varchar", { nullable: true })
  views: number | undefined; //这里的类型是ts类型，表里的类型是mySQL的数据类型

  @Column("varchar", { nullable: true })
  create_time: Date | undefined;

  @Column("varchar", { nullable: true })
  update_time: Date | undefined;

  @Column("varchar", { nullable: true })
  is_delete: number | undefined;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User | undefined;

  @OneToMany(() => Comment, (comment) => comment.article) //(comment) => comment.article绑定映射关系
  comments!: Comment[]
  //我们在article里使用comment，所以在index文件中，要先声明comment，再声明article
}
