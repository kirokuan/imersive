import * as express from 'express';
import * as session from 'express-session';
import * as errorHandler from 'errorhandler';
import * as mongo from 'connect-mongo';
import * as path from 'path';
import mongoose from './export/mongoose';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import { default as User } from './models/User';
import { login, logOut, register } from './api/user';
const app = express();

const MongoStore = mongo(session);


mongoose.connect(process.env.MONGODB_URI);

app.use(errorHandler());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "6b75593d2a402d674d7e4b6b4346275e",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    }),
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
    } catch (e) {
        console.error(e);
    }
});
app.post("/login", login);
app.post("/register", register);
app.post("/logout", logOut);
app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * Start express server.
 */
app.listen(process.env.PORT, () => {
    console.log(
        `  App is running at ${process.env.URL}:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
    console.log('  Press CTRL-C to stop.\n');
});
