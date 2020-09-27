import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users.dto';
import { User } from '../interfaces/users.interface';
import CommentService from '../services/comment.service';
const url = require('url');

class YoutubeController {
  public commentService = new CommentService();

  public subscribe = async (req: any, res: Response, next: NextFunction) => {
    
    const queryObject = url.parse(req.body.url,true).query;
    const videoId = queryObject.v;
    const keywords = queryObject.keywords.split(",");
    const roomId = req.user.sub;
    try {
      const message = await this.commentService.getComments(roomId, videoId, keywords);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  public unSubscribe = async (req: any, res: Response, next: NextFunction) => {
    const roomId = req.user.sub;
    try {
      const message = await this.commentService.unSubscribe(roomId);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default YoutubeController;
