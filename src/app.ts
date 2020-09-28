import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as logger from 'morgan';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import * as passport from 'passport';
import YoutubeServie from 'services/youtube.service';
const GoogleStrategy = require('passport-google-oauth20');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

class App {
  public app: express.Application;
  public port: (string | number);
  public env: boolean;
  public passport: any;
  public io: any;
  public server: any;
  public ys: YoutubeServie;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 1337;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.initializeMiddlewares();
    this.initializePassport();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
    this.initializeSocketIO();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: process.env.APP_URL, credentials: true }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializePassport() {
    this.app.use(passport.initialize());
    passport.use(new GoogleStrategy({
      clientID: '113357917861-dp79sii6f7n6gfg8bj8hpvgvnthaebj8.apps.googleusercontent.com',
      clientSecret: 'cEufGj8Nnu0AQ1o3s_Px6XQs',
      callbackURL: `${process.env.APP_URL}/auth/google/callback`
    },
    function(accessToken: string, refreshToken: string, profile: any, done: Function) {
      done(null, profile);
    }
    ));
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    passport.use(new JwtStrategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    }, (token: object, done: any) => {
        return done(null, token);
    }));
  }

  private initializeSocketIO() {
    this.io = require('socket.io')(this.server);
    this.io.listen(1342);
    this.io.on('connection', (socket: any) => {
      console.log('Client connected.');
      socket.on('disconnect', () => console.log('a user disconnected'));
      socket.on('join', (data: any) => {
        console.log(data.sub);
        socket.join(data.sub);
      });
    });
  }

  public setYoutubeServie(ys: YoutubeServie) {
    this.ys = ys;
  }

  public getYoutubeServie() {
    return this.ys;
  }
}

export default App;
