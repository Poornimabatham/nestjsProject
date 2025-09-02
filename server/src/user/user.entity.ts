import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document & {
  _id: Types.ObjectId;
};

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;
  // ❌ This likely caused the error
  // resetToken?: string | null;

  // ✅ Fix by specifying type
  @Prop({ type: String, default: null })
  resetToken: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiry: Date | null;
}


export const UserSchema = SchemaFactory.createForClass(User);
