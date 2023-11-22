import { Module } from '@nestjs/common';
import PlatformCustomerController from './customer.controller';
import PlaformCustomerService from './customer.service';

@Module({
  controllers: [PlatformCustomerController],
  providers: [PlaformCustomerService],
})
class PlatformCustomerModule {}

export default PlatformCustomerModule;
