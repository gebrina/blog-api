import { Controller, Body, Post } from '@nestjs/common';
import { AuthService, Public } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  singIn(@Body() user) {
    return this.authService.signIn(user?.email, user?.password);
  }
}
