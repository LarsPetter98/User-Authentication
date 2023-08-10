import express from "express";
import passport from "passport";
import connection from "./createNewUser.mjs";
import {createNewPassword} from "./createNewPassword.mjs";
import {isAuthenticated, isAdmin} from "./authenticateMiddleware.mjs"

const router = express.Router() // Creates our routing method
const User = connection.models.User

// When we login, this checks if our password and username is correct
router.post("/login", passport.authenticate("local", {failureRedirect: "/login-failure", successRedirect: "/login-success"}));

// When we register, this route sends the register info to our database
router.post("/register", (request, response, next) => {

    // Får tak i salt og hash fra createNewPassword
    const saltAndHash = createNewPassword(request.body.password);
    const salt = saltAndHash.salt;
    const hash = saltAndHash.hash;

    // Lager et mongoose dokument fra modelen "User", hvor vi legger all informasjonen om brukeren
    const newUser = new User({
        username: request.body.username,
        salt: salt,
        hash: hash,
        admin: true
    })

    // Lagrer dokumentet i MongoDB
    newUser.save()
           .then((user) => {
            console.log(user)
            response.redirect("/login");
           })
})

// Creates our homepage where we can either register or login
router.get("/", (request, response, next) => {
    response.send(`<h1>Home Page</h1><a href="/login">Log in</a><div><a href="/register">Register</a></div>`);
    response.end();
})

// Creates our login page
router.get("/login", (request, response, next) => {

    const loginForm = `<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>`

    response.send(loginForm);
})

// Creates our register page
router.get("/register", (request, response, next) => {

    const registerForm = `<h1>Register Page</h1><form method="post" action="/register">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>`

    response.send(registerForm);
})

// Creates our logout functionality
router.get('/logout', (request, response, next) => {
    request.logout(function(error) {
       if(error){return next(error)};
    });
    response.redirect('/login');
// Note: request.logout deletes the request.session.passport.user property
});

// Creates our login-success-admin page
router.get('/login-success-admin', isAdmin, (request, response, next) => {
    response.send('<h1>You are logged in with admin clearance</h1><p><a href="/logout">Logout</a></p>');
});

// Creates our login-success page
router.get('/login-success', isAuthenticated, (request, response, next) => {
    response.send('<h1>You are logged in</h1><p><a href="/logout">Logout</a></p>');
});

// Creates our login failure page
router.get('/login-failure', (request, response, next) => {
    response.send('You entered the wrong password.');
    response.send(`<div><a href="/login">Click here to login</a></div>`)
}); 

export default router