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
  const user = await User.findOne({ username: req.body.username.toLowerCase() });
  if (!user) {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      lastLogin: new Date()
    });
    await newUser.save();
    req.logIn(newUser, err => {
      if (err) {
        return next(err);
      }
      res.sendStatus(201);
    });
  } else {
    res.sendStatus(403);
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const user: any = await User.findOne({ username: req.body.username.toLowerCase() });
  if (!user) {
    res.sendStatus(401);
  } else {
    user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
      if (err) {
        return next(err);
      }
      if (!isMatch) {
        res.sendStatus(403);
      } else {
        // TODO: use JWT?? 
        req.logIn(user, err => {
          if (err) {
            return next(err);
          }
          res.sendStatus(201);
        });
      }
    });
  }

}
export const logOut = (req: Request, res: Response) => {
  req.logout();
  res.sendStatus(204);
};
