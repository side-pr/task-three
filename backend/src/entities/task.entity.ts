import { BaseModel } from 'src/entities/base-model.entity';
import { Member } from 'src/entities/member.entity';
import { Schedule } from 'src/entities/schedule.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Task extends BaseModel {
  @Column()
  name: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  isCompleted: boolean;

  @ManyToOne(() => Member, (member) => member.id)
  member: Member;

  @OneToOne(() => Schedule, (schedule) => schedule.task)
  schedule: Schedule | null;
}
