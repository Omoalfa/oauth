import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
    const req = context.switchToHttp().getRequest();

    const state = JSON.stringify({
      slug: req?.hosts?.slug,
      host: req?.hosts?.domain,
    });

    return { state };
  }
}

export default GoogleOAuthGuard;
