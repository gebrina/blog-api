import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'Password1',
      port: 5432,
      database: 'blog',
      entities: ['dist/entities/**/*.js'],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './files/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    BlogModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
