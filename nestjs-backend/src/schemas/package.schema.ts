import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PackageDocument = Package & Document;

@Schema({ timestamps: true })
export class Package {
  @Prop({ required: true, unique: true })
  pid: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: ['Regular', 'Digital'], default: 'Regular' })
  type: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true, min: 1 })
  maxAds: number;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ type: String, enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Prop({
    type: String,
    enum: ['Popular', 'Recommended', 'None'],
    default: 'None',
  })
  popularity: string;

  @Prop({ default: '' })
  icon: string;

  @Prop({ default: 0 })
  subscriberCount: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

PackageSchema.pre('save', function (next) {
  if (!this.pid) {
    this.pid = `#PKG${Math.floor(10000 + Math.random() * 90000)}`;
  }
  next();
});
