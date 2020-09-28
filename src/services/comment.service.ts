import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/users.interface';
import { Comment } from '../interfaces/comments.interface';
import userModel from '../models/users.model';
import { isEmptyObject, containsKeywords } from '../utils/util';
import YoutubeServie from './youtube.service';
import app from './../server';  
const {EventEmitter} = require('events');

class CommentService {
  public ys: YoutubeServie;
  public async getComments(roomId: string, videoId: string, keywords: []): Promise<Object> {
    if (!videoId) throw new HttpException(400, "Invalid video Id");


    this.ys = new YoutubeServie(videoId,process.env.API_KEY);
    app.setYoutubeServie(this.ys);
    this.ys.on('ready', () => {
      this.ys.listen(10000)
    })
     
    this.ys.on('message', (data: any) => {
      console.log(data.snippet.displayMessage);
      
      if(containsKeywords(keywords, data.snippet.displayMessage)) {
        app.io.sockets.in(roomId).emit('message', {
          code: 'message',
          message: data
        });
      }
    })
     
    this.ys.on('error', (error: Object) => {
      console.log(error);
      
      app.io.sockets.in(roomId).emit('message', {
        code: 'error',
        message: 'Cannot fetch comments'
      });
      this.ys.stop();
    })

    return { message: "Subscribed"};
  }

  public async unsubscribe(roomId: string): Promise<Object> {
    try{
      this.ys = app.getYoutubeServie();
      this.ys.stop();
    } catch(error) {

    }

    return { message: "Unsubscribed"};
  }
}

export default CommentService;
