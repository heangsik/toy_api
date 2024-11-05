import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/meta/public.meta';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userService.findOne(payload.email);
      if (!user) {
        Logger.log(`not found user : ${payload.email}`);
        throw new UnauthorizedException();
      }
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
