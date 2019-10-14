import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { default as User, UserModel } from '../models/User';
import * as passport from 'passport';
import * as passPortConfig from '../export/passport';
export const register = async (req: Request, res: Response, next: NextFunction) => {
  check('username').isLength({ min: 4 });
  check('password').isLength({ min: 4 });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(422).json({ errors: errors.array() });
  }
  User.findOne({ username: req.body.username.toLowerCase() }, (err, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        lastLogin: new Date()
      });
      newUser.save(err => {
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
    } else {
      res.sendStatus(401);
    }
  });
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  User.findOne({ username: req.body.username.toLowerCase() }, (err, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("no user"));
    }
    user.comparePassword(req.body.passport, (err: Error, isMatch: boolean) => {
      if (err) {
        return next(err);
      }
      if (!isMatch) {
        res.sendStatus(401);
      }
      res.sendStatus(201);
    });
  });

}
export const logOut = (req: Request, res: Response) => {
  req.logout();
  res.sendStatus(204);
};
