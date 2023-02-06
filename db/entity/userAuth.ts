import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn
} from "typeorm";
// import { CommonEntity } from "./commonEntity";
import { User } from "./user";

@Entity({ name: "user_auth" }) //要和表名一致
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column("varchar", { name: "identity_type" })
  identity_type: string | undefined;

  @Column("varchar")
  identifier: string | undefined; // 不写类型| undefined会报错

  @Column("varchar")
  credential: string | undefined;

  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User | undefined;  // 根据 user_id查到的user对象，名称就是 user
}
