import { Blog } from '../entities/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    private userService: UserService,
  ) {}

  public findAll(query: PaginateQuery): Promise<Paginated<Blog>> {
    return paginate(query, this.blogRepo, {
      relations: ['user'],
      sortableColumns: ['id', 'title'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['title'],
      select: [
        'user.id',
        'user.email',
        'user.username',
        'title',
        'description',
        'media',
        'content',
        'id',
      ],
      filterableColumns: {
        //  title: [FilterOperator.EQ, FilterSuffix.NOT],
        //title: true,
      },
    });
  }

  // async findAll(): Promise<Blog[]> {
  //   return await this.blogRepo.find({ relations: { user: true } });
  // }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!blog) throw new NotFoundException(`Can't find blog with ${id} Id`);
    return blog;
  }

  async create(blog: Blog): Promise<Blog> {
    const createdBlog = await this.blogRepo.save(blog);
    return this.findOne(createdBlog.id);
  }

  async update(id: string, blog: Blog): Promise<Blog> {
    await this.findOne(id);
    await this.blogRepo.update(id, blog);

    return await this.findOne(id);
  }

  async delete(id: string) {
    return await this.blogRepo.delete(id);
  }
}
