import * as express from 'express';
import * as session from 'express-session';
import * as errorHandler from 'errorhandler';
import * as mongo from 'connect-mongo';
import * as path from 'path';
import mongoose from './export/mongoose';
import { login, logOut } from './api/user';
const app = express();

const MongoStore = mongo(session);


mongoose.connect(process.env.MONGODB_URI);
app.use(errorHandler());

app.post("login", login);
app.post("logout", logOut);
app.get( "/", ( req, res ) => {
    res.sendStatus(201);
});
app.use(express.static(path.join(__dirname, 'public'))); 

/**
 * Start express server.
 */
app.listen(process.env.PORT, () => {
    console.log(
        `  App is running at ${process.env.URL}:${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
    console.log('  Press CTRL-C to stop.\n');
});
