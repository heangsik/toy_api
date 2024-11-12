import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiSecurity,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response-uesr.dto';
import { Http } from 'winston/lib/winston/transports';
import { Public } from 'src/meta/public.meta';
import { Roles } from 'src/meta/role.meta';
import { Role } from 'src/util/enums/role.enum';
import { RolesGuard } from 'src/auth/role.guard.ts.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: '유저 생성', description: '유저를 생성합니다.' })
  @ApiResponse({ status: 201, description: '성공', type: UserResponseDto })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '잘못된 요청입니다.',
  })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);

    const userResponse = plainToInstance(UserResponseDto, result, {
      excludeExtraneousValues: true,
    });
    Logger.log(`create controller---- : ${JSON.stringify(userResponse)}`);
    return userResponse;
  }

  @Get('all')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Public()
  @ApiOperation({ summary: '유저 조회', description: '유저를 조회합니다.' })
  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
