import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MemberService } from 'src/service/member.service';
import { Member } from 'src/entities/member.entity';

declare global {
  namespace Express {
    interface Request {
      member?: Member;
    }
  }
}

@Injectable()
export class VisitorMiddleware implements NestMiddleware {
  constructor(private readonly memberService: MemberService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const visitorId = req.headers['x-visitor-id'] as string;

    console.log('[VisitorMiddleware] Request received:', {
      method: req.method,
      url: req.url,
      visitorId: visitorId || 'not provided',
    });

    if (visitorId) {
      const member =
        await this.memberService.findOrCreateByVisitorId(visitorId);
      req.member = member;
      console.log('[VisitorMiddleware] Member found/created:', {
        memberId: member.id,
        visitorId: visitorId,
      });
    } else {
      console.log('[VisitorMiddleware] No visitor ID provided');
    }

    next();
  }
}
