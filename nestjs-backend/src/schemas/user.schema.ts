import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, sparse: true, trim: true })
  username: string;

  @Prop({ unique: true, sparse: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true, trim: true })
  mobile: string;

  @Prop()
  password: string;

  @Prop({ trim: true })
  fullName: string;

  @Prop({ type: Date })
  dob: Date;

  @Prop({
    type: String,
    enum: ['Internal Student', 'External Student', 'Teacher'],
  })
  userType: string;

  @Prop({ trim: true })
  district: string;

  @Prop({ trim: true })
  zone: string;

  @Prop({ trim: true })
  grade: string;

  @Prop({ trim: true })
  school: string;

  @Prop({ type: String, enum: ['Sinhala', 'Tamil', 'English'] })
  medium: string;

  @Prop({ trim: true })
  institution: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  otp: string;

  @Prop({ type: Date })
  otpExpires: Date;

  @Prop()
  verifytoken: string;

  async matchPassword(enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};
