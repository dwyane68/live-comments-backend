import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';
import CommentService from '../services/comment.service';
const url = require('url');

class YoutubeController {
  public commentService = new CommentService();

  public subscribe = async (req: any, res: Response, next: NextFunction) => {
    console.log(req.body.url);
    
    const queryObject = url.parse(req.body.url,true).query;
    try {
      const videoId = queryObject.v;
      const keywords = queryObject.keywords.split(",");
      const roomId = req.user.sub;
      const message = await this.commentService.getComments(roomId, videoId, keywords);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  public unsubscribe = async (req: any, res: Response, next: NextFunction) => {
    try {
      const roomId = req.user.sub;
      const message = await this.commentService.unsubscribe(roomId);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default YoutubeController;
