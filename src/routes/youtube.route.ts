import { Router } from 'express';
import YoutubeController from '../controllers/youtube.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
const passport = require('passport');

class YoutubeRoute implements Route {
  public router = Router();
  public youtubeController = new YoutubeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`/subscribe`, authMiddleware, this.youtubeController.subscribe);
    this.router.post(`/unsubscribe`, authMiddleware, this.youtubeController.unsubscribe);
    // this.router.post(`/subscribe`, this.youtubeController.subscribe);
    
  }
}

export default YoutubeRoute;
