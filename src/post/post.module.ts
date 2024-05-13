import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import PhotoEntity from 'src/entities/photo.entity/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
