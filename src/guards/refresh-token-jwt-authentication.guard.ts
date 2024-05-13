/* eslint-disable prettier/prettier */
import { AuthGuard } from "@nestjs/passport";

/* eslint-disable prettier/prettier */
export default class RefreshJwtAuthenticationGuard extends AuthGuard('jwt-refresh-token') {
 
}
