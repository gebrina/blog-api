import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      const user = await this.jwtService.verify(token, {
        secret: process.env.JWT_SERCTET_KEY,
      });
      if (!user) throw new UnauthorizedException('Invalid token');
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
    return false;
  }

  extractTokenFromHeader(request: Request) {
    const [bearer, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token) throw new UnauthorizedException('Token required');
    return token;
  }
}
