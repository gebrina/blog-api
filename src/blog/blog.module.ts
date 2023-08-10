import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog } from '../entities/blog.entity';
import { UserModule } from '../user/user.module';
@Module({
  imports: [TypeOrmModule.forFeature([Blog]), UserModule],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
