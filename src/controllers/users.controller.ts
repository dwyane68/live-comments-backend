import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';
import userService from '../services/users.service';

class UsersController {
  public userService = new userService();

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;

    try {
      const createUserData: User = await this.userService.findOrCreateUser(userData);
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  }
}

export default UsersController;
