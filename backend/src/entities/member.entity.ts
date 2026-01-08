import { BaseModel } from 'src/entities/base-model.entity';
import { SocialType } from 'src/entities/social-type';
import { Column, Entity } from 'typeorm';

@Entity()
export class Member extends BaseModel {
  @Column({
    type: 'varchar',
    nullable: false,
  })
  socialType: SocialType;

  @Column({ type: 'varchar', length: 255 })
  providerId: string;
}
