import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from 'src/meta/public.meta';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: '이메일과 패스워드로 로그인합니다. JWT발행한다',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: '성공', type: LoginResponseDto })
  @Public()
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    Logger.log(`Login : ${JSON.stringify(dto)}`);
    const result = await this.authService.login(dto);

    Logger.debug(`Login result : ${JSON.stringify(result)}`);

    const userResponse = plainToInstance(LoginResponseDto, result, {
      excludeExtraneousValues: true,
    });

    Logger.debug(`Login response : ${JSON.stringify(userResponse)}`);

    return userResponse;
  }
}
