// src/auth/jwt-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers?.authorization || '';

    if (!auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = auth.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');

    try {
      const payload = jwt.verify(token, secret) as any;

      // חשוב: נשמור תאימות לשמות שהשתמשת בהם קודם
      req.user = {
        id: payload.id,
        userId: payload.id,
        is_admin: !!payload.is_admin,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
