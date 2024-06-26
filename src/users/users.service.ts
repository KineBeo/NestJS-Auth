/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async getById(id: number) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (user) {
            return user;
        }

        throw new BadRequestException('User with this id does not exist');
    }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email }
        });
        if (user) {
            return user;
        }

        throw new BadRequestException('User with this id does not exist');
    }

    async create(userData: CreateUserDto) {
        const newUser = this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async count(email: string) {
        return this.usersRepository.count({ where: { email } });
    }
}