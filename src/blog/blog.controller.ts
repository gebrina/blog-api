import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseInterceptors,
  UploadedFile,
  Controller,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { Blog } from '../entities/blog.entity';
import { diskStorage } from 'multer';
import { Public } from '../auth/auth.service';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  @Public()
  findAll(@Query() query): any {
    return this.blogService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<Blog> {
    return this.blogService.findOne(id);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const fileName = file.originalname.split(' ').join('-');
          cb(null, Date.now() + fileName);
        },
      }),
    }),
  )
  create(
    @Body() blog: Blog,
    @UploadedFile() file: Express.Multer.File,
    @Headers('host') host: string,
  ): Promise<Blog> {
    const uploadedUrl = 'http://' + host + '/' + file.filename;
    blog.media = uploadedUrl;
    return this.blogService.create(blog);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const fileName = file.originalname.split(' ').join('-');
          cb(null, Date.now() + fileName);
        },
      }),
    }),
  )
  update(
    @Body() blog: Blog,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Headers('host') host: string,
  ): Promise<Blog> {
    const uploadedUrl = 'http://' + host + '/' + file.filename;
    blog.media = uploadedUrl;
    return this.blogService.update(id, blog);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
