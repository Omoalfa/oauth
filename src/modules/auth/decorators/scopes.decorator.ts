import { SetMetadata } from '@nestjs/common';

const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);

export default Scopes;
