import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { isEmptyObject } from '../utils/util';
import userService from '../services/users.service';
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

class AuthService {
  public users = userModel;
  public userService = new userService();

  public async googleLogin(userData: CreateUserDto): Promise<{ token: string, findUser: User }> {
    if (isEmptyObject(userData)) throw new HttpException(400, "Invalid user");

    let findUser: User = this.users.find(user => user.email === userData.email);
    if (!findUser) {
      findUser = await this.userService.createUser(userData);
    };

    this.users.push(findUser)

    const tokenData = this.createToken(findUser);
    const token = tokenData.token;
    // const cookie = this.createCookie(tokenData);

    return { token, findUser };
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60 * 24;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
