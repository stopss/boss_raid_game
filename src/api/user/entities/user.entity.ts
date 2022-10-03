import { RaidReocrdEntity } from 'src/api/bossraid/entities/raidRecord.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  totalScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => RaidReocrdEntity, (raidRecord) => raidRecord.enteredUserId)
  raidRecord: RaidReocrdEntity[];
}
