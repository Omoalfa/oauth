import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('platform_customer_group')
class PlatformCustomerGroup {
  @PrimaryGeneratedColumn()
  id: number;
}

export default PlatformCustomerGroup;
