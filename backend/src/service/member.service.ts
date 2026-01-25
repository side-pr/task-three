import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities/member.entity';
import { SocialType } from 'src/entities/social-type';
import { Repository } from 'typeorm';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async findOrCreateByVisitorId(visitorId: string): Promise<Member> {
    let member = await this.memberRepository.findOne({
      where: {
        socialType: SocialType.VISITOR,
        providerId: visitorId,
      },
    });

    if (!member) {
      member = this.memberRepository.create({
        socialType: SocialType.VISITOR,
        providerId: visitorId,
      });
      member = await this.memberRepository.save(member);
    }

    return member;
  }
}
