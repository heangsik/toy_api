import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the User',
    maxLength: 100,
    minLength: 5,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The name of the User',
    maxLength: 100,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    description: 'The password of the User',
    maxLength: 100,
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
