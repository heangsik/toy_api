import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    title: 'User No',
    example: 'aoijdadfnasdfalsj',
  })
  id: string;
  @Expose()
  @ApiProperty({
    title: 'User Email',
    example: 'test@kcp.co.kr',
  })
  email: string;
  @Expose()
  @ApiProperty({
    title: 'User Name',
    example: 'test name',
  })
  name: string;
}
