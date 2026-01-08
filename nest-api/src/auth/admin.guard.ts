// src/auth/admin.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // JwtAuthGuard כבר שם req.user
    const isAdmin = !!req?.user?.is_admin;

    if (!isAdmin) {
      throw new ForbiddenException('Admin only');
    }

    return true;
  }
}
