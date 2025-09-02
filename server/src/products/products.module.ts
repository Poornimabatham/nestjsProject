import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { User, UserSchema } from 'src/user/user.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // 👇 Must be inside imports, not at root
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
