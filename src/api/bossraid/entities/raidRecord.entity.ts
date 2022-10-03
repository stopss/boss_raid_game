import { UserEntity } from 'src/api/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'raidrecord' })
export class RaidReocrdEntity {
  @PrimaryGeneratedColumn()
  raidRecordId: number;

  @Column()
  enteredUserId: number;

  @Column()
  level: string;

  @Column({ nullable: true })
  score: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  enterTime: Date;

  @UpdateDateColumn()
  endTime: Date;

  @ManyToOne(() => UserEntity, (user) => user.raidRecord)
  @JoinColumn([{ name: 'enteredUserId', referencedColumnName: 'userId' }])
  user: UserEntity;
}
