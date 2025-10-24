import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log("isMatch", user.password_hash);
    console.log("isMatch", password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  getAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  getRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, tenant_id: user.tenant_id, role: user.role };

    const access_token = this.getAccessToken(payload);
    const refresh_token = this.getRefreshToken(payload);

    return {
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
    };
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const access_token = this.getAccessToken({
        sub: payload.sub,
        tenant_id: payload.tenant_id,
        role: payload.role,
      });

      return { access_token };
    } catch {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
