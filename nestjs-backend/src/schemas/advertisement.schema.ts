import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdvertisementDocument = Advertisement & Document;

@Schema({ timestamps: true })
export class Advertisement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: String,
    enum: [
      'Land Sale',
      'House Sale',
      'Vacancies',
      'Baby Staff',
      'Business Ads',
      'Rent',
      'Service',
      'Courses',
      'Vehicles',
      'Electronics',
      'Clothes',
      'Other',
      'Health & Beauty',
      'Shop Sale',
      'Food & Events',
    ],
  })
  category: string;

  @Prop({ required: true, maxlength: 100 })
  heading: string;

  @Prop({ required: true })
  details: string;

  @Prop({ required: true })
  phone1: string;

  @Prop()
  phone2: string;

  @Prop()
  whatsapp: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  district: string;

  @Prop({ type: [String], required: false })
  images: string[];

  @Prop({ required: true })
  verifiedContact: string;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: string;

  @Prop()
  rejectionReason: string;

  @Prop({ type: Date, default: Date.now })
  postingDate: Date;

  @Prop({ default: 0 })
  views: number;
}

export const AdvertisementSchema =
  SchemaFactory.createForClass(Advertisement);
