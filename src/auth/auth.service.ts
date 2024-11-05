import {
  Injectable,
  Logger,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { JwtService } from '@nestjs/jwt';
import e from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    Logger.log(`find user : ${JSON.stringify(dto)}`);
    const user = await this.userService.findOne(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Logger.log(`find user : ${JSON.stringify(user)}`);

    // 패스워드 체크
    const isPasswordValid = bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      Logger.log('Invalid password');
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600, // 1시간
      user: payload,
    };
  }
}
