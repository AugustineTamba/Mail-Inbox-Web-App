const mongoose = require("mongoose");

// user schema - defining the properties of a user;
const UserDetailSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {type: String, unique: true},
        password: String,
        userType: String,
    },
    {
        // store it in a collection
        collection: "userInfo",
    }
);

// create model to pass the collection name and the schema
mongoose.model("userInfo", UserDetailSchema)