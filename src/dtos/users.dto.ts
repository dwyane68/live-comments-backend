import { IsEmail, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public name: string;

  @IsString()
  public picture: string;

  @IsString()
  public sub: string;

  @IsString()
  public given_name: string;

  @IsString()
  public family_name: string;

  @IsString()
  public locale: string;

  @IsBoolean()
  public email_verified: boolean;
}