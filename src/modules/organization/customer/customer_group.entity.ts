import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organization_customer_group')
class OrganizationCustomerGroup {
  @PrimaryGeneratedColumn()
  id: number;
}

export default OrganizationCustomerGroup;
