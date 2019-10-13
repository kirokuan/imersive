import mongoose from '../export/mongoose';
import * as bcrypt from 'bcrypt-nodejs';
export type UserModel = mongoose.Document & {
    username: string;
    password: string;
    lastLogin: Date;
};

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    lastLogin: Date
});
UserSchema.pre('save', function save(next) {
    const user = this as UserModel;
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });
  
  UserSchema.methods.comparePassword = function(
    candidatePassword: string,
    cb: (err: any, isMatch: any) => {},
  ) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    });
  };
const User = mongoose.model('user', UserSchema);
export default User;