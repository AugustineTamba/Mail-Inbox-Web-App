const express = require("express");
const app = express();
const mongoose = require("mongoose")

const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234567890abcdefghijklmnopqrstuvwxyz`-=[]\'/.,\!@#$%^&*()_+{}|:?><~";
const SESSION_SECRET = "1234567890abcdefghijklmnopqrstuvwxyz`-=[]\'/.,\!@#$%^&*()_+{}|:?><~";

app.set("view engine", "ejs"); // to use ejs engine
app.use(express.urlencoded({ extended: false })); // when we received a data from ejs we should 

const nodemailer = require('nodemailer');

const { ServerApiVersion } = require('mongodb');
const { sendResetPasswordEmail } = require("./emailService");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const mongoUrl = "mongodb+srv://athegreat231:Password123@learningapi.zga3vus.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}).then(() => {console.log("Connected to database");}).catch(e => console.log(e, "Not connected"))

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false, // Set to true in production if using HTTPS
        sameSite: 'strict', // Adjust as needed
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: mongoUrl
    }),
}));



// Enable CORS with specific origin and credentials
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json())

app.listen(5000, ()=>{
    console.log("Server started")
})

// testing the server
// app.post("/post", async(req, res) => {
//     console.log(req.body);

//     const {data} = req.body;

//     try {

//         if(data == "augustine the great"){
//             res.send({status: "ok"});
//         } else {
//             res.send({status: "User Not Found"})
//         }
        
//     } catch (error) {
//         res.send({status: "error: something went wrong, try again!"})
//     }
// })


//// import the schema in the app.js


require("./userDetails");
const user = mongoose.model("userInfo")

// register api 
app.post("/register", async(req, res) => {
    const {firstName, lastName, email, password, userType} = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const existingUser = await user.findOne({ email });
        // check if there is an existing account with that email address
        if (existingUser) {
            console.log("Something went Wrong! Check and try again")
            return res.send({status: "User already exists!"})
        }

        await user.create({
            firstName,
            lastName,
            email,
            password: encryptedPassword,
            userType,
        });

        req.session.userId = user._id;

        res.send({status: "ok"})

    } catch (error) {
        res.send({status: "error"})
    }
})

// Login API
app.post("/login", async(req, res) => {
    const { email, password } = req.body; // Get user email and password

    try {
        const User = await user.findOne({ email }); // Check if there is an existing account with that email address

        if (!User) {
            return res.json({ status: "error", error: "Invalid Email / User Not Found!" }); // If email doesn't exist
        }

        const isValidPassword  = await bcrypt.compare(password, User.password);
        if (!isValidPassword ) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Set userId in the session
        req.session.userId = User._id;
        return res.json({ status: "ok", User, message: 'Login successful'});

    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
});

// getting users data through session
app.get("/userdata", async (req, res) => {

    const authenticatedUserId = req.session.userId;
    console.log(authenticatedUserId)

    if (!authenticatedUserId) {
        return res.json({ status: "error", data: "User not Found or Not Authenticated" });
    }

    try {
        const userData = await user.findById(authenticatedUserId);

        if (!userData) {
            res.json({ status: "error", data: "User not found" });
        } 

        res.json({ status: "ok", data: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ status: "error", error: "Internal Server Error" });
    }
});

app.get("/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId; // Accessing the userId from req.params
  
      const User = await user.findById(userId);
      if (!User) return res.status(404).json({ error: "User not found" });
      res.json({ User });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


// when user click on forgot password

app.post("/forgot-password", async(req, res) => {
    const { email } = req.body;

    try {

        const existingUser  = await user.findOne({ email }); // check if there is an existing account with that email address if exit okay
        if (!existingUser) {
            return res.json({status: "User Not Found!"}) // if email don't exit 
        }

        // but if user exist => generate secret 
        const secret = JWT_SECRET +  existingUser.password;
        const token = jwt.sign({email: existingUser.email, id: existingUser._id }, secret, {
            expiresIn: "5d",
        });

        // send this token to the user via email
        const link = `http://localhost:5000/reset-password/${existingUser._id}/${token}`;
        
        // Use the sendResetPasswordEmail function
        await sendResetPasswordEmail(existingUser.email, link);

        //res.json({status: "email send"})
        console.log(link)

    } catch (error) {
        return res.json({ status: "error", error: "Internal Server Error" });
    }

})

// when the link is send the below reset password => will come into working

app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params; // receieved id and token from the link

    try {
        // check again if the user exist
        const existingUser = await user.findOne({ _id: id });

        if (!existingUser) {
            return res.json({ status: "User Not Found!" });
        }

        // if the user exist we create the secret
        const secret = JWT_SECRET + existingUser.password;
        // verify is the know token is correct
        const verify = jwt.verify(token, secret);
        // If verification is successful, you can render the view
        res.render("index", { email: verify.email });
    } catch (error) {
        // If verification fails, handle the error
        console.error(error);
        return res.send("Not Verified");
    }
});


// here we are posting the reset password

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body; // receive password from the resquest

    try {
        // check if user exist
        const existingUser = await user.findOne({ _id: id });

        if (!existingUser) {
            return res.json({ status: "User Not Found!" });
        }

        // if user exist encrypt the password and update it 
        const secret = JWT_SECRET + existingUser.password;
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);

        await user.updateOne(
            {
                _id: id,
            }, 
            {
                $set: {
                    password: encryptedPassword,
                }
            }
        );

        //res.json({status: "Password Updated"});

        res.render("passwordchange");
    } catch (error) {
        // If verification fails, handle the error
        console.error(error);
        res.json({status: "Password Not Updated"});
    }
});


require("./messages");
const Messages = mongoose.model("Message")

// Define API endpoints
app.get('/api/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const messages = await Messages.find({userId: userId})
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// create a new message
app.post('/api/createMessage', async (req, res) => {
    const { subject, content } = req.body;
    const authenticatedUserId = req.session.userId;

    try {
        const messageData = {
            userId: authenticatedUserId,
            subject,
            content,
            isRead: false // Initially set as unread
        };
          const newMessage = await Messages.create(messageData);
          console.log("Message created successfully:", newMessage);
          res.status(201).json(newMessage);

    } catch (error) {
        res.status(400).json({ error: 'Bad Request' });
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get messages by id
app.get ('/api/:messageID', async (req, res) => {
   
    try {
        const { messageID } = req.params; // pass the messgageID as a route parameter
        const message = await Messages.findById(messageID);
    
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
    
        res.status(200).json(message);
      } catch (error) {
        console.error('Error getting Message by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.patch('/api/messages/:userId/:messageId/read', async (req, res) => {
    try {
        const messageId = req.params.messageId;       
        const userId = req.params.userId;

        // Check if both userId and messageId exist in the database
        const message = await Messages.findOne({ _id: messageId, userId: userId });
        if (!message) {
            return res.status(404).json({ error: "Message not found for the given user" });
        }

        // Check if the message is already read
        // if (message.isRead) {
        //     return res.status(400).json({ error: "Message is already marked as read" });
        // }

        await Messages.findOneAndUpdate({ _id: messageId, userId: userId }, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error marking message as read:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/api/messages/unread/count', async (req, res) => {
    const authenticatedUserId = req.session.userId;

    try {
      // Count the number of messages where isRead is false in your database
      const unreadCount = await Messages.countDocuments({ userId: authenticatedUserId, isRead: false });
      res.status(200).json({ count: unreadCount });
    } catch (error) {
      console.error("Error fetching unread message count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// Define API endpoint to get unread messages count for a specific user
app.get("/api/messages/unread/count/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Assuming your messages schema has a field 'userId' to store the user ID who received the message
      const unreadCount = await Messages.countDocuments({ userId: userId, isRead: false });
  
      res.status(200).json({ status: 'ok', count: unreadCount });
    } catch (error) {
      console.error("Error fetching unread message count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// Define API endpoint to get all messages count for a specific user
app.get("/api/messages/count/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Assuming your messages schema has a field 'userId' to store the user ID who received the message
      const allMessagesCount = await Messages.countDocuments({ userId: userId });
  
      res.status(200).json({ status: 'ok', count: allMessagesCount });
    } catch (error) {
      console.error("Error fetching all messages count:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


// Backend API for sending messages
app.post('/api/send-message', async (req, res) => {
    try {
      const { recipientEmail, subject, content } = req.body;
  
      // Validate recipient email, subject, and message
      if (!recipientEmail || !subject || !content) {
        return res.status(400).json({ error: 'Recipient email, subject, and message content are required.' });
      }
  
      // Convert recipient email to userId
      const recipientUser = await user.findOne({ email: recipientEmail });
      if (!recipientUser) {
        return res.status(404).json({ error: 'Recipient user not found.' });
      }
      const recipientUserId = recipientUser._id;
  
      // Get the authenticated user's ID from the authentication middleware or wherever it's stored
      const authenticatedUserId = req.session.userId; // Assuming you have userId stored in the request object
  
      // Create message data
      const messageData = {
        userId: recipientUserId._id, // Sender's userId
        recipientUserId, // Recipient's userId
        subject,
        content,
        isRead: false // Initially set as unread
      };
  
      // Save the message to the database
      const newMessage = await Messages.create(messageData);
      console.log("Message created successfully:", newMessage);
  
      res.status(201).json({ success: true, message: 'Message sent successfully.' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

app.post('/api/logout', async(req, res) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
});
  
  