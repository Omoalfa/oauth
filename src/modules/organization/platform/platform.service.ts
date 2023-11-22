import { Injectable } from '@nestjs/common';

export interface EmployeeCtx {
  id: number;
  companyId: number;
  employeeId: number;
  roleId: number;
}

@Injectable()
class PlatformService {
  constructor() {} // @InjectRepository(Users) private readonly UserRepository: Repository<Users>,
}

export default PlatformService;
