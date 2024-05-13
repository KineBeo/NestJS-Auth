/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PhotoEntity from 'src/entities/photo.entity/photo.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PhotoEntity)
        private postsRepository: Repository<PhotoEntity>
    ) { }

    async getAllPosts() {
        console.log('------------- getAllPosts() called --------------');
        return await this.postsRepository.find();
    }

    async getPostById(id: number) {
        console.log("-------------------------------getPostById() called");
        const post = await this.postsRepository.findOne({
            where: { id }
        });
        if (post) {
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }


    async createPost(post: CreatePostDto) { 
            console.log("----------------------createPost() called");
            const newPost = await this.postsRepository.create(post);
            await this.postsRepository.save(newPost);
            return newPost;
    }

    async updatePost(id: number, post: UpdatePostDto) {
        console.log("----------------------updatePost() called");
        await this.postsRepository.update(id, post);
        const updatedPost = await this.postsRepository.findOne({
            where: { id }
        });
        if (updatedPost) {
            return updatedPost;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }


    async deletePost(id: number) {
        console.log("------------------------ deletePost() called");
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}
