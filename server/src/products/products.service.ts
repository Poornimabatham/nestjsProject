import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

    async getAllUsers(search?: string): Promise<User[]> {
      console.log(search, "search")
    const filter = search
      ? { name: { $regex: search, $options: 'i' } } // case-insensitive search on "name"
      : {};

    return this.userModel.find(filter).exec();
  }
}
