import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const users: User[] = this.users;
    return users;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "Invalid user data");

    const user: User = this.users.find(user  => user.email === userData.email);
    if (user) throw new HttpException(409, `user already exists`);
    
    const createUserData: User = { id: (this.users.length + 1), ...userData };

    return createUserData;
  }

  public async findOrCreateUser(userData: CreateUserDto): Promise<User> {
    if (isEmptyObject(userData)) throw new HttpException(400, "Invalid user data");

    const user: User = this.users.find(user  => user.email === userData.email);
    if (user) return user;
    
    const createUserData: User = { id: (this.users.length + 1), ...userData };

    return createUserData;
  }
}

export default UserService;
