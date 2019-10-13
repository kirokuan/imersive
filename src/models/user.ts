import mongoose from '../export/mongoose';

export type UserModel = mongoose.Document & {
    username: string;
    password: string;
};

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('user', UserSchema);
export default User;