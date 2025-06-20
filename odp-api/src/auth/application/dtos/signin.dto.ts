import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Username or email of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Username or email is required' })
  @MinLength(3)
  username: string; // ใช้สำหรับรับ username หรือ email

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
