import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly model = this.prisma.user;

  async create(dto: CreateUserDto) {
    const data: Prisma.UserCreateInput = {
      email: dto.email,
      name: dto.name,
      password: await bcrypt.hash(dto.password, 10),
    };

    const user = await this.findOne(dto.email);

    if (user) {
      throw new ConflictException('User already exists');
    }
    const result = await this.model.create({ data });
    Logger.log(
      `create user success :  name=${result.name}, email=${result.email}`,
    );
    return result;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    const user = await this.model.findUnique({ where: { email: email } });
    Logger.log(`find user : ${JSON.stringify(user)}`);

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
