import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    const createdUser = await this.userRepo.save(user);
    return this.findOne(createdUser.id);
  }

  async update(id: string, user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    await this.userRepo.update(id, user);
    return await this.findOne(id);
  }

  findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: { blogs: true } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { blogs: true },
    });
    if (!user) throw new NotFoundException(`Can't find user with ${id} Id`);
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email });
    return user;
  }

  async delete(id: string) {
    return await this.userRepo.delete(id);
  }
}
