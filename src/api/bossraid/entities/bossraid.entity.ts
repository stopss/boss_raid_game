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

export enum Level {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
}

@Entity({ name: 'raidRecord' })
export class RaidReocrdEntity {
  @PrimaryGeneratedColumn()
  raidRecordId: number;

  @Column()
  enteredUserId: number;

  @Column({ type: 'enum', enum: Level, default: Level.LEVEL_1 })
  level: Level;

  @Column({ nullable: true })
  score: number;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  enterTime: Date;

  @UpdateDateColumn()
  endTime: Date;

  @DeleteDateColumn()
  deleteAt: Date;
  
  @ManyToOne(() => UserEntity, (user) => user.raidRecord)
  @JoinColumn([{ name: 'enteredUserId', referencedColumnName: 'userId' }])
  user: UserEntity;
}
