import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { create } from 'domain';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      name: 'testName',
      password: 'testPassword',
    };

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createUser = {
      id: '1',
      email: createUserDto.email,
      name: createUserDto.name,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(createUser);
    jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(() => Promise.resolve('hashedPassword'));

    const result = await service.create(createUserDto);

    expect(result).toEqual(createUser);

    expect(prismaService.user.create).toBeCalledWith({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: 'hashedPassword',
      },
    });
  });
});
