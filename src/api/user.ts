import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { default as User, UserModel } from '../models/User';
import * as passport from 'passport';

export const postLogin = async (req: Request, res: Response, next: NextFunction) => {

  check('password').isAlphanumeric();
  check('password').isLength({ min: 4 });

  const errors = validationResult(req);
  // let errors=null;
  if (!errors.isEmpty()) {
    return res.sendStatus(422).json({ errors: errors.array() });
  }
  passport.authenticate('local', (err: Error, user: UserModel, info?: { message: string }) => {
    if (err) {
      return next(err);
    }
    if (info) {
      const code = +info.message;
      if (code) {
        return res.sendStatus(401);
      }
      if (!user || !code) {
        const newUser = new User({
          email: req.body.username,
          password: req.body.password
        });
        return newUser.save(err => {
          if (err) {
            return next(err);
          }
          req.logIn(newUser, err => {
            if (err) {
              return next(err);
            }
            res.sendStatus(201);
          });
        });
      }
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      res.sendStatus(204);
    });
  })(req, res, next);
};
