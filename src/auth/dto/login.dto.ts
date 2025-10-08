import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@demo.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'ChangeMe123!' })
  password: string;
}
