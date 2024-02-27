const mongoose = require("mongoose");

// user schema - defining the properties of a user;
const messageSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.ObjectId, required: true},
        subject: String,
        content: String,
        isRead: Boolean
    },
    {
        // store it in a collection
        collection: "Message",
    }
);

// create model to pass the collection name and the schema
mongoose.model("Message", messageSchema)