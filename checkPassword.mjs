import passport from "passport";
import passportLocal from "passport-local";
import connection from "./createNewUser.mjs";
import crypto from "crypto";

const LocalStrategy = passportLocal.Strategy; // Defines the local strategy which we'll use to authenticate
const User = connection.models.User; // Gets the "User" document we created in "createNewUser.mjs"

// Validates the password by checking if the hash generated with the given password and the same salt as stored in the
// database is the same hash as stored in the database
function validatePassword (password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === hashVerify; // Return either true or false
}

// Creates the object where passport will store the username and password provided by the user at login
// Password will be accessible under the property "username", and password under "password"
const customFields = {
    usernameField: "username",
    passwordField: "password"
}

const verifyCallback = (username, password, done) => {

    // Finds a document in our database where the username property has the same value as the username given to us
    User.findOne({username: username})
        .then((user) => {
            
            if(!user) {return done(null, false)} // If the user is not found, return false which means user not found

            const isValid = validatePassword(password, user.hash, user.salt) // At this point we know the username is
            // correct. Here we're invoking the functions that checks if the password is correct

            if (isValid) {return done(null, user)} // If the password is correct, return the user object which means
            // the user is validated and gets access to the login-success page

            if (!isValid) {return done(null, false)} // If the password is incorrect, return false which means the user
            // is not validated and is returned to the login page
        })
        .catch((error) => {
            done(error) // If there's an error in our code, catch() will send the error to our terminal
        })
}

const strategy = new LocalStrategy(customFields, verifyCallback); // Define our strategy for authenticating
passport.use(strategy); // Passport uses our strategy for authenticating

// Grabs the id of the user in the database and then inserts it in the request.session.passport.user property
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Using the id from the session to find the user in the db and attaches the found user to the request.user object
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(error => done(error));
})


