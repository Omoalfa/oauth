
import UserRoles from "../../../../modules/auth/user_roles.entity";
import { DataService } from "../db.service";


export interface UserRolesRepository {
  find(data: { where: Partial<UserRoles>, relations: { [key: string]: boolean } }): Promise<UserRoles[]>;
  // update(filter: Partial<Users>, update: Partial<Users>): Promise<void>;
  // create(user: Partial<Users>): Users;
  // save(user: Users): Promise<Users>;
  // remove(id: number): Promise<void>;
  // findOneBy(data: Partial<Users>): Promise<Users>;
}

class MockUserRolesRepository implements UserRolesRepository {
  constructor () {
    this.dataService = new DataService()

    this.user_roles = this.dataService.getTable("user_roless");
  }
  private dataService: DataService;
  private user_roles: UserRoles[] = [];

  async find(data: { where: Partial<UserRoles>, relations: { [key: string]: boolean } }): Promise<UserRoles[]> {
    let userRoles = this.user_roles.filter((user) => {
      let isTrue = true;

      for (let key in data.where) {
        if (user[key] !== data[key]) {
          isTrue = isTrue && false;
        }
      }

      return isTrue;
    });

    for (let key in data.relations) {
      userRoles = userRoles.map((ur) => {
        ur[key] = ''
        return {
          ...ur
        }
      })
    }
    
    return userRoles;
  }
}

export default MockUserRolesRepository;
