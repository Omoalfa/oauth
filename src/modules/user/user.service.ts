import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Users from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
class UserService {
  constructor (
    @InjectRepository(Users) private readonly UserRepository: Repository<Users>
  ) {}
}

export default UserService;
