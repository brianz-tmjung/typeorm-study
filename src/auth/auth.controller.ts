import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './gaurd/basic-token.guard';
import {
  accessTokenGuard,
  refreshToKenGuard,
} from './gaurd/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerWithEmail(
    @Body('email') email: string,
    @Body('nickname') nickname: string,
    @Body('password', new MaxLengthPipe(8 ), new MinLengthPipe(3))  
  ) {
    return this.authService.registerWithEmail({ email, nickname, password });
  }

  @Post('login')
  loginWithEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }
  @Post('login/email')  
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('token/access')
  @UseGuards(refreshToKenGuard)
  postTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    return { accessToken: newToken };
  }

  @Post('token/refresh')
  @UseGuards(refreshToKenGuard)
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    return { refreshToken: newToken };
  }
}
