/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import RegisterDto from './dto/register.dto';
import PostgresErrorCode from '../database/postgresErrorCode.enum';
@Injectable()
export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
    }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword,
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === PostgresErrorCode.UniqueViolation) {
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async login(email: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            return {
                accessToken: this.getJwtTokenForUser(user.id, user.email, user.name),
                refreshToken: await this.generateRefreshToken(user.email),
            };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    public async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
    
    // Return a access token for the user
    public getJwtTokenForUser(userId: number, email: string, name: string) {
        const payload = { userId, email, name };
        return this.jwtService.sign(payload);
    }

    // Generate a refresh token for the user
    async generateRefreshToken(userEmail: string) {
        const user = await this.usersService.getByEmail(userEmail);
        const payload = { email: user.email };
        const refreshToken = this.jwtService.sign(
            payload, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
                // expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                expiresIn: '1d',
            }
        );
        
        console.log(`Refresh token expires in: ${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`);
        
        user.currentHashedRefreshToken = refreshToken;
        console.log(user);
        return refreshToken;
    }

    // Request to get a new access token using the refresh token
    async validateRefreshTokenToGetAccessToken(refreshToken: string) {
        const user = await this.jwtService.decode(refreshToken);
        // const isRefreshTokenMatching = await bcrypt.compare(
        //     refreshToken,
        //     user.currentHashedRefreshToken
        // );
        // if (!isRefreshTokenMatching) {
        //     throw new UnauthorizedException('Refresh token does not match');
        // }
        return this.getJwtTokenForUser(user.id, user.email, user.name);
    }

    async isTokenExpired(token: string) {
        // Check if the token is expired
        const isTokenExpired = this.jwtService.verify(token);
        return isTokenExpired;
    }

}   
