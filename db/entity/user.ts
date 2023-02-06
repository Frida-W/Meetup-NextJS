import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
// import { CommonEntity } from './commonEntity';

@Entity({ name: "users" }) // name 就是这个实体对应的表名
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column("varchar", { nullable: false })
  nickname!: string;

  @Column("varchar", { nullable: false })
  avatar!: string;

  @Column("varchar", { nullable: true })
  job: string | undefined;

  @Column("varchar", { nullable: true })
  introduce: string | undefined;
}
