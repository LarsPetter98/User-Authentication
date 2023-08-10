import express from "express";
import session from "express-session";
import passport from "passport";
import routes from "./routes.mjs";
import bodyParser from "body-parser";
import connectMongoDBSession from "connect-mongodb-session";
import "./checkPassword.mjs";
import dotenv from "dotenv";

const app = express(); // Creates express app
const MongoStore = connectMongoDBSession(session); // Connecting session to MongoDB
dotenv.config(); // Enables us to acess and process the variables in our .env file

app.use(bodyParser.json()); // Middleware for parsing post request data except html post form
app.use(bodyParser.urlencoded({extended: false})); // Middleware for parsing html post form data

app.use(session({ // Creates a session with a cookie. The id of our session is sent with the cookie to the browser
    secret: process.env.SECRET, // A string used to create the password hash
    resave: false, // For every request to our server the cookie will not be reset
    saveUninitialized: true, // Our sessions will be saved also when it is not modified
    store: new MongoStore(  // The storage for our sessions
        {
            mongoUrl: "mongodb://localhost:27017/login3", // Points to our database
            collectionName: "sessions", // Points to the collection in our database
        }
    ),
    cookie: {
        httpOnly: true, // Our cookie is only sent to our server
        secure: false, // Our cookie is only sent with https protocol
        sameSite: "strict", // The browser will only send our cookie with requests to our server
        maxAge: 1000 * 60 * 60 * 24 // How much time before the cookie is deleted. This logic equals 1 day
    }

}))

app.use(passport.initialize()) // Starts the passport module
app.use(passport.session()) // Passport adds the password and username from the client side to our session object

app.use(routes) // Using our routes defined in "routes.mjs"

app.listen(5000); // Our server listen at port 3000