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
      
      (req as any).user = payload;
      (req as any).tenantId = payload.tenant_id;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
