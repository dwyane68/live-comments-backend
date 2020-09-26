import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import AuthService from '../services/auth.service';

class AuthController {
  public authService = new AuthService();

  public googleLogin = async (req: any, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.user._json;
    try {
      const { token, findUser } = await this.authService.googleLogin(userData);
      res.status(200).json({ data: {user: findUser, token}, message: 'success' });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
