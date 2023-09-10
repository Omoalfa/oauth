import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/entities/user.entity';

const Roles = Reflector.createDecorator<UserRoles[]>();

export default Roles;
