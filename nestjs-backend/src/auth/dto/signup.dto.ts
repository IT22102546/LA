import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CompleteSignupDto {
  @IsString()
  @IsOptional()
  mobile: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsNotEmpty()
  userType: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  zone: string;

  @IsString()
  @IsOptional()
  grade: string;

  @IsString()
  @IsOptional()
  school: string;

  @IsString()
  @IsOptional()
  medium: string;

  @IsString()
  @IsOptional()
  institution: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class RequestMobileVerificationDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;
}

export class VerifyMobileOtpDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  tempUserId: string;
}
