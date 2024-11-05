import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserResponseDto } from 'src/user/dto/response-uesr.dto';

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    title: 'Access Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;
  @Expose()
  @ApiProperty({
    title: 'Refresh Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken: string;
  @Expose()
  @ApiProperty({
    title: 'Expires In',
    example: 3600,
  })
  expiresIn: number;
  @Expose()
  @ApiProperty({ title: 'User Info', type: UserResponseDto })
  user: UserResponseDto;
}
