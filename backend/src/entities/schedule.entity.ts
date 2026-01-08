import { BaseModel } from 'src/entities/base-model.entity';
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

  @OneToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task: Task | null;
}
