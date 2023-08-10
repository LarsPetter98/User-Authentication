import crypto from "crypto";

export function createNewPassword (password) {
    let salt = crypto.randomBytes(32).toString("hex"); // Creates salt, a pseudo random number
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex"); // Creates a hash, a long random
    // string that represents the user's password in the database
    return {
        salt: salt, // Returns our salt and hash
        hash: hash
    }
}