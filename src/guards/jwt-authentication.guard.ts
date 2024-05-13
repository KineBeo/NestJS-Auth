/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

// This class is a guard that will be used 
// to protect routes that require a valid JWT token to access.

// We can use it every time we want our users to authenticate before making requests.
@Injectable()
export default class JwtAuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException("Token is required")
    }

    token = token.replace('Bearer ', '');
    try {
        const payload = this.jwtService.decode(token);
        console.log(payload);
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new UnauthorizedException("Token has expired");
        }
        return true;
      }
    catch(e) {
        console.log(e)
        return false;
      }
    }
}

