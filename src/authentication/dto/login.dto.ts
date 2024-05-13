/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
 
export class LoginDto {
    @ApiProperty({required: true})
  @IsEmail()
  email: string;

  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}
 
export default LoginDto;