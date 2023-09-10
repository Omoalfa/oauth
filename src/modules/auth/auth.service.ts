import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Users from "src/entities/user.entity";
import { Repository } from "typeorm";
import TokenService, { DecodedToken } from "../token/token.service";

@Injectable()
class AuthService {
  constructor (
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly tokenService: TokenService
  ) {}

  public validateUser = async (data: { email: string, name?: string, avatar?: string, id?: number }, type: 'jwt' | 'google'): Promise<Users> => {
    const { email, name, avatar } = data;
    let user = await this.userRepository.findOneBy({ email });
    if (user) return user;
    if (type === 'google') {
      const new_user = this.userRepository.create({ email, name, avatar })
      return await this.userRepository.save(new_user);
    }
    return null;
  }

  public login = async (user: Users) => {
    const token = this.tokenService.sign({ email: user.email, sub: user.id, role: user.role })

    return { token };
  }

  public verifyToken = (token: string) : DecodedToken => {
    return this.tokenService.verify(token);
  } 
}

export default AuthService;
