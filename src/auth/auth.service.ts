import { Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

export const IS_PUBLIC_KEY = 'true';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid email address!');
    const vaildPassword = await bcrypt.compare(password, user.password);
    if (!vaildPassword) {
      throw new UnauthorizedException('Invalid Password!');
    }
    const { password: userPassword, ...other } = user;
    const access_token = await this.jwtService.signAsync(other);
    return { user: other, access_token };
  }
}
