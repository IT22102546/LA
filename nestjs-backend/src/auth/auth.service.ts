import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import {
  SignInDto,
  CompleteSignupDto,
  RequestMobileVerificationDto,
  VerifyMobileOtpDto,
} from './dto';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'projecttest088@gmail.com',
    pass: 'vyzl bowj hshd apbo',
  },
});

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const token = this.jwtService.sign({
      id: user._id,
      isAdmin: user.isAdmin,
    });

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.verifytoken;

    return {
      ...userObject,
      token,
    };
  }

  async requestMobileVerification(dto: RequestMobileVerificationDto) {
    const { mobile } = dto;

    const existingUser = await this.userModel.findOne({
      mobile,
      isVerified: true,
    });

    if (existingUser) {
      throw new BadRequestException('Mobile number already registered');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await this.userModel.findOne({ mobile, isVerified: false });

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      user = new this.userModel({
        mobile,
        otp,
        otpExpires,
        isVerified: false,
      });
    }

    await user.save({ validateBeforeSave: false });

    return {
      success: true,
      message: 'OTP sent successfully',
      tempUserId: user._id,
      otpExpires: otpExpires,
    };
  }

  async verifyMobileWithOtp(dto: VerifyMobileOtpDto) {
    const { mobile, otp, tempUserId } = dto;

    const user = await this.userModel.findOne({
      _id: tempUserId,
      mobile,
      otp,
      otpExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const tempToken = this.jwtService.sign(
      { id: user._id, temp: true },
      { expiresIn: '1h' },
    );

    return {
      success: true,
      message: 'Mobile number verified successfully',
      tempToken,
      tempUserId: user._id,
    };
  }

  async completeSignup(dto: CompleteSignupDto) {
    const {
      mobile,
      email,
      fullName,
      dob,
      userType,
      district,
      zone,
      grade,
      school,
      medium,
      institution,
      password,
    } = dto;

    const generateUsername = (fullName: string) => {
      const baseUsername = fullName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/\s+/g, '');

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      return `${baseUsername}${randomSuffix}`;
    };

    const username = generateUsername(fullName);

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }, ...(mobile ? [{ mobile }] : [])],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('Email already registered');
      }
      if (existingUser.username === username) {
        throw new BadRequestException('Username already taken');
      }
      if (existingUser.mobile === mobile) {
        throw new BadRequestException('Mobile number already registered');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      mobile,
      fullName,
      dob: new Date(dob),
      userType,
      district,
      zone,
      grade,
      school,
      medium,
      institution,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    return {
      success: true,
      message: 'Signup completed successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        username: newUser.username,
      },
    };
  }

  async checkAccountExists(emailOrPhone: string) {
    const isEmail = emailOrPhone.includes('@');
    let user = null;

    if (isEmail) {
      user = await this.userModel.findOne({
        email: emailOrPhone.toLowerCase(),
        isVerified: true,
      });
    } else {
      const cleanMobile = emailOrPhone.replace(/\D/g, '');

      user = await this.userModel.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` },
        ],
        isVerified: true,
      });
    }

    if (!user) {
      return {
        success: false,
        exists: false,
        message: isEmail
          ? 'No account found with this email'
          : 'No account found with this phone number',
      };
    }

    return {
      success: true,
      exists: true,
      message: 'Account found',
      userType: user.userType,
      isEmail: isEmail,
      userId: user._id,
    };
  }

  async sendPasswordResetOtp(emailOrPhone: string, isEmail: boolean) {
    let user;

    if (isEmail) {
      user = await this.userModel.findOne({
        email: emailOrPhone.toLowerCase(),
        isVerified: true,
      });
    } else {
      const cleanMobile = emailOrPhone.replace(/\D/g, '');

      user = await this.userModel.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` },
        ],
        isVerified: true,
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });

    if (isEmail) {
      await this.sendEmailOtp(emailOrPhone, otp);
    }

    return {
      success: true,
      message: `OTP sent successfully via ${isEmail ? 'email' : 'WhatsApp'}`,
      emailOrPhone: isEmail
        ? emailOrPhone
        : emailOrPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      otpExpires: otpExpires,
      isEmail: isEmail,
      userId: user._id,
    };
  }

  private async sendEmailOtp(email: string, otp: string) {
    const mailOptions = {
      from: 'Learn APP <projecttest088@gmail.com>',
      to: email,
      subject: 'Learn APP - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; text-align: center;">Learn APP</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #000; margin-bottom: 10px;">Password Reset Request</h3>
            <p style="color: #666; margin-bottom: 20px;">
              Use the following OTP code to reset your password. This code will expire in 10 minutes.
            </p>
            <div style="background: #fff; padding: 15px; border-radius: 8px; text-align: center; border: 2px dashed #3b82f6;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              If you didn't request this OTP, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyPasswordResetOtp(emailOrPhone: string, isEmail: boolean, otp: string) {
    let user;

    if (isEmail) {
      user = await this.userModel.findOne({
        email: emailOrPhone.toLowerCase(),
        isVerified: true,
      });
    } else {
      const cleanMobile = emailOrPhone.replace(/\D/g, '');

      user = await this.userModel.findOne({
        $or: [
          { mobile: cleanMobile },
          { mobile: `94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `+94${cleanMobile.substring(cleanMobile.length - 9)}` },
          { mobile: `0${cleanMobile.substring(cleanMobile.length - 9)}` },
        ],
        isVerified: true,
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.otp || !user.otpExpires) {
      throw new BadRequestException('No active OTP found. Please request a new one.');
    }

    if (new Date() > user.otpExpires) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP code. Please try again.');
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const resetToken = this.jwtService.sign(
      { id: user._id, type: 'password_reset' },
      { expiresIn: '1h' },
    );

    return {
      success: true,
      message: 'OTP verified successfully',
      resetToken,
      userId: user._id,
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const decoded = this.jwtService.verify(resetToken);

    if (decoded.type !== 'password_reset') {
      throw new BadRequestException('Invalid reset token');
    }

    const user = await this.userModel.findById(decoded.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
