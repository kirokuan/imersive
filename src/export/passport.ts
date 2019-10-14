import * as passport from 'passport';
import { default as User } from '../models/User';
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });