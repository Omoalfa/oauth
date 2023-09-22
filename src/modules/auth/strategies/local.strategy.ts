import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import AuthService from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    console.log(username, password);
    // const user = await this.authService.validateUser({ email: username, password}, 'local');
    // if (!user) {
    //   throw new NotAcceptableException();
    // }
    return { username, password };
  }
}
