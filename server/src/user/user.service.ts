import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(email: string, name: string, password: string): Promise<UserDocument> {
    const checkUser = await this.findOne(email);
    if (checkUser) {
      throw new ConflictException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });
  }

  async update(userId: string | Types.ObjectId, updateData: Partial<User>): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
    
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    
    return updatedUser;
  }

  async findByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }
      })
      .exec();
  }
}

