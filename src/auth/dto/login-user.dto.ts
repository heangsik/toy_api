import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Email',
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    title: 'Password',
    example: '1234',
  })
  password: string;
}
