import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
const passport = require('passport');

class AuthRoute implements Route {
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/auth/google',  passport.authenticate('google', { scope: ['profile','email'] }));
    this.router.get('/auth/google/callback',  passport.authenticate('google'), this.authController.googleLogin)
    this.router.get(`/test`, authMiddleware);
    
  }
}

export default AuthRoute;
