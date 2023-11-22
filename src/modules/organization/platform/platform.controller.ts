import { Controller } from '@nestjs/common';

@Controller({ path: '/', host: 'platform.:domain' })
class PlatformController {}

export default PlatformController;
