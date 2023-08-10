import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  singIn(@Body() user) {
    return this.authService.signIn(user?.email, user?.password);
  }
}
