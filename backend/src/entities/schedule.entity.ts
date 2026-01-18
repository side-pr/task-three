import { BaseModel } from 'src/entities/base-model.entity';
import { Task } from 'src/entities/task.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

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

  @OneToOne(() => Task, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'task_id' })
  task: Task | null;
}
