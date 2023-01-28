import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import {User} from "./user"

@Entity({ name: "user_auth" }) //要和表名一致
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  identity_type: string;

  @Column("text")
  identifier: string;

  @Column("text")
  credential: string;

  @ManyToOne(() => User,{
    cascade: true
  })
  @JoinColumn({name:"user_id"})
  user: User
}
