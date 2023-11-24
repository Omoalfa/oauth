// import Users from "../../../../modules/auth/user.entity";
// import { DataService } from "../db.service";


// export interface UserRepository {
//   findAll(): Promise<Users[]>;
//   update(filter: Partial<Users>, update: Partial<Users>): Promise<void>;
//   create(user: Partial<Users>): Users;
//   save(user: Users): Promise<Users>;
//   remove(id: number): Promise<void>;
//   findOneBy(data: Partial<Users>): Promise<Users>;
// }

// // usersUsers.mock.repository.ts
// class MockUserRepository implements UserRepository {
//   constructor () {
//     this.dataService = new DataService()

//     this.users = this.dataService.getTable("users");
//   }
//   private dataService: DataService;
//   private users: Users[] = [];

//   async findAll(): Promise<Users[]> {
//     return this.users;
//   }

//   async update(filter: Partial<Users>, update: Partial<Users>): Promise<void> {
//     const user = await this.findOneBy(filter);

//     await this.save({
//       ...user, ...update
//     })
//   }

//   async findOneBy(data): Promise<Users | undefined> {
//     return this.users.find((user) => {
//       let isTrue = true;

//       for (let key in data) {
//         if (user[key] !== data[key]) {
//           isTrue = isTrue && false;
//         }
//       }

//       return isTrue;
//     });
//   }

//   syncFindOneBy(data): Users | undefined {
//     return this.users.find((user) => {
//       let isTrue = true;

//       for (let key in data) {
//         if (user[key] !== data[key]) {
//           isTrue = isTrue && false;
//         }
//       }

//       return isTrue;
//     });
//   }

//   create(user: Users): Users {
//     // if ()
//     const newUser = { ...user, id: this.users.length + 1 };
//     // this.users.push(newUser);
//     return newUser;
//   }

//   async save(user: Users): Promise<Users> {
//     const index = this.users.findIndex((u) => u.email === user.email);
//     if (index >= 0) {
//       this.users[index] = user;
//     } else if (user.id) {
//       this.users.push(user);
//     }
//     this.dataService.updateTable("users", this.users);
//     return user;
//   }

//   async remove(id: number): Promise<void> {
//     const index = this.users.findIndex((user) => user.id === id);
//     if (index >= 0) {
//       this.users.splice(index, 1);
//     }
//     this.dataService.updateTable("users", this.users);
//   }
// }

// export default MockUserRepository;
