// When the user is authenticated, he is redirected to the login-success page. At login-sucess we use this function
// to check if the user has the admin property attached to its user object. If it has, then the user is redirectet to
// login-success-admin page. If not the user stays at login-success
export function isAuthenticated (request, response, next) {
    if(request.isAuthenticated() && request.user.admin) {
        response.redirect("/login-success-admin");
    }
    else if(request.isAuthenticated()) {
        next()
    }
    else {
        response.status(401).send("You are not authorized to view this resource")
    }
}

// We add this function to the login-success-admin page to make sure that only users who is authenticated and has the
// admin property is able to access the page
export function isAdmin (request, response, next) {
    if(request.isAuthenticated() && request.user.admin) {
        next()
    }
    else {
        response.status(401).send("You are not authorized to view this resource because you are not an admin")
    }
}