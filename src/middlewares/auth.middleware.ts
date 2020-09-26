import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken, RequestWithUser, TokenData } from '../interfaces/auth.interface';
import userModel from '../models/users.model';
const passport = require('passport');

function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false, }, async (error: object, token: DataStoredInToken) => {
    if (error || !token) {
      next(new HttpException(401, 'Unauthorized'));
    } 
    try {
      const user = userModel.find(user => user.id === token.id);
      console.log(user, userModel);
      
      if(!user) {
        next(new HttpException(401, 'Unauthorized'));
      }
      req.user = user;
    } catch (error) {
        next(error);
    }
    next();
  })(req, res, next); 
}

export default authMiddleware;
