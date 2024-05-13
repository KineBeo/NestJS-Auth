/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RequestWithUser from './requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import RegisterDto from './dto/register.dto';
import LoginDto from './dto/login.dto';
import refreshJwtAuthenticationGuard from 'src/guards/refresh-token-jwt-authentication.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly jwtService: JwtService,
    ) {

    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @Post('login')
    async logIn(@Body() body: LoginDto) {
        const { email, password } = body;
        return this.authenticationService.login(email, password)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        return response.sendStatus(200);
    }

    @UseGuards(refreshJwtAuthenticationGuard)
    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        const { refreshToken } = body;
        return this.authenticationService.validateRefreshTokenToGetAccessToken(refreshToken)
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate() {
        try {
            return {
                message: "Is passed guard"
            }
        } catch (error) {
            if (error.message === 'Token has expired') {
                return {
                    message: "Token has expired"
                }
            }
        }
    }
}

