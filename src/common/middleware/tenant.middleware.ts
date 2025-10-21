import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
     console.log("from middleware", payload);
      (req as any).user = payload;

      // ✅ Allow PLATFORM_ADMIN even without tenant_id
      if (payload.role === 'PLATFORM_ADMIN') {
        (req as any).tenantId = null;
      } else if (payload.tenant_id) {
        (req as any).tenantId = payload.tenant_id;
      } else {
        throw new UnauthorizedException('Missing tenant context');
      }
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    next();
  }
}
