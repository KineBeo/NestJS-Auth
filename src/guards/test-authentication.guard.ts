/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export default class TestAuthenticationGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,) {

    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest();
        let token = request.headers.authorization;
        if (!token) {
            throw new UnauthorizedException("Token is required");
        }
        token = token.replace('Bearer ', '');
        console.log(token);
        try {
            const payload = this.jwtService.decode(token);
            console.log(payload);
        
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    }
}