/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import JwtAuthenticationGuard from 'src/guards/jwt-authentication.guard';
import Role from 'src/enum/role.enum';
import RoleGuard from 'src/guards/role.guard';

@Controller('post')
export class PostController {
    constructor(
        private readonly postsService: PostService
    ) { }

    @UseGuards(RoleGuard(Role.Admin))
    @Get()
    async getAllPosts() {
        return await this.postsService.getAllPosts();
    }

    @Get(':id')
    getPostById(@Param('id') id: string) {
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() post: CreatePostDto) {
        return this.postsService.createPost(post);
    }


    @Put(':id')
    async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postsService.updatePost(Number(id), post);
    }

    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    async deletePost(@Param('id') id: number) {
        this.postsService.deletePost(Number(id));
    }
}
