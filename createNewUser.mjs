import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_STRING = process.env.DB_STRING; // A string that connects us to our MongoDB database

// Creates a connection to our MongoDB database
const connection = mongoose.createConnection(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a MongoDB userschema
const UserSchema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String,
    admin: Boolean
})

// Creates a MongoDB model called User and that has the content defined in our "UserSchema"
const User = connection.model("User", UserSchema);

// Export connection, where our new MongoDB document is stored
export default connection;