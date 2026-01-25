import { BaseModel } from 'src/entities/base-model.entity';
import { Member } from 'src/entities/member.entity';
import { Task } from 'src/entities/task.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class Schedule extends BaseModel {
  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'date' })
  targetDate: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  completedAt: string | null;

  @OneToOne(() => Task, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'task_id' })
  task: Task | null;

  @ManyToOne(() => Member, (member) => member.id, { nullable: true })
  member: Member | null;
}
