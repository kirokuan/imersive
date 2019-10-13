import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { default as User, UserModel } from '../models/User';
import * as passport from 'passport';

export const login = async (req: Request, res: Response, next: NextFunction) => {

  check('password').isAlphanumeric();
  check('password').isLength({ min: 4 });

  const errors = validationResult(req);
  // let errors=null;
  if (!errors.isEmpty()) {
    return res.sendStatus(422).json({ errors: errors.array() });
  }
  const newUser = new User({
    email: req.body.username,
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

};

export const logOut = (req: Request, res: Response) => {
  req.logout();
  res.sendStatus(204);
};
