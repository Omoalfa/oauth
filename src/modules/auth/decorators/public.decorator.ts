import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'is_public';

const Public = () => SetMetadata(IS_PUBLIC, true);

export default Public;
