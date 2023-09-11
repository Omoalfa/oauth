import { EScopes } from '@/modules/company/user/scopes';
import { Reflector } from '@nestjs/core';

const Scopes = Reflector.createDecorator<EScopes[]>();

export default Scopes;
