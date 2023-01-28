import { Column, Entity, BaseEntity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" }) //要和表名一致
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  nickname: string;

  @Column("text")
  avatar: string;

  @Column("text")
  job: string;

  @Column("text")
  introduce: string;
}
