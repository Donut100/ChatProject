const express = require("express")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const User = require("./models/User");
const Chat = require("./models/Chat");
const Message = require("./models/Message");
const { userValidator, messageValidator } = require('./validators/validators');

const app = express();
const port = 8080; // default port to listen
const acknowledgement = JSON.stringify({ result: "OK" })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('this_is_the_best_app!!!'));

mongoose.connect("mongodb://localhost:27017/reactChatApp")
    .then(() => console.log("Mongoose Connected"))
    .catch((err) => console.error(`Mongoose connection failed: ${err}`))

function catchErrors(f) {
    async function wrapper(req, res) {
        try {
            await f(req, res)
        } catch (error) {
            res.status(406).send({ "message": error.message })
        }
    }
    return wrapper
}
function validate(schema) {
    function wrapper(req, res, next) {
        const { error } = schema.validate(req.body);
        if (error) {
            const message = error.details.map(e => e.message).join(',');
            console.log(message);
            res.status(400).send({ message })
        }
        else {
            next();
        }
    }
    return wrapper;
}
function inforceLogin(req, res, next) {
    const { userId } = req.signedCookies;

    if ((!userId) || userId === false) {
        return res.redirect('/signup');
    }
    next();
}

app.post("/signup", validate(userValidator), catchErrors(async (req, res) => {
    const user = new User(req.body);
    const exists = await User.exists({ "name": user.name })

    if (exists) {
        throw Error(`User with name ${user.name} already exists, try a diffrent username`)
    }

    user.save();

    res.cookie('userId', user._id, { signed: true });
    res.send(JSON.stringify({ "id": user._id }));
}));

app.post("/login", validate(userValidator), catchErrors(async (req, res) => {
    const user = new User(req.body);
    const { _id: id, name, password } = user;
    if ((!await User.exists({ name })) || (!await User.exists({ name, password }))) {
        throw Error("Username and/or password are invalid");
    }
    // res.set("Set-Cookie", `userId=${user._id} path=/; samesite=lax;?`);
    res.cookie('userId', user._id, { signed: true, httpOnly: false, sameSite: "lax" });
    res.send(JSON.stringify({ id }))
}));

// get messages
app.get("/chats/:chatId", inforceLogin, catchErrors(async (req, res) => {
    const { chatId } = req.params;
    const found = await Chat.findById(chatId);
    if (!found) {
        throw Error(`chatId "${chatId}" cannot be found`);
    }
    res.send(JSON.stringify(found.messages))
}))

// delete message
app.delete("/chats/:chatId/:messageId", inforceLogin, catchErrors(async (req, res) => {
    const { chatId, messageId } = req.params;
    const { senderId } = req.signedCookies;

    const found = await Chat.findOne({
        _id: mongoose.Types.ObjectId(chatId),
        "messages._id": mongoose.Types.ObjectId(messageId),
        "messages.ownerId": mongoose.Types.ObjectId(senderId)
    });
    console.log(found);
    if (!found) {
        throw Error("message was not found")
    }
    await Chat.findByIdAndUpdate(found._id, {
        $pull: {
            messages: {
                "_id": mongoose.Types.ObjectId(messageId),
                "ownerId": mongoose.Types.ObjectId(senderId)
            }
        }
    },
    );

    res.send(acknowledgement);
}));

// add message
app.post("/chats/:chatId", inforceLogin, validate(messageValidator), catchErrors(async (req, res) => {
    const { chatId } = req.params;
    const found = await Chat.findById(chatId);
    if (!found) {
        throw Error(`chatId "${chatId}" cannot be found`);
    }
    await Chat.findByIdAndUpdate(found._id, { "$push": { messages: req.body } });
    res.send(acknowledgement);
}));


// adds new chat
app.post("/chats", inforceLogin,/* TODO: validate req.body for chat */ catchErrors(async (req, res) => {
    await Chat.insertOne(req.body);
    res.send(acknowledgement);
}));

app.patch("/chats", inforceLogin,/* TODO: validate req.body for chat + ownerId*/ catchErrors(async (req, res) => {
    const { chat } = req.body;
    const { id: chatId } = chat;
    const { ownerId } = req.signedCookies

    const found = await Chat.find({ _id: mongoose.Types.ObjectId(chatId), ownerId: mongoose.Types.ObjectId(ownerId) })
}));

// get all chats
app.get("/chats", inforceLogin, catchErrors(async (req, res) => {
    const chats = [];
    const found = await Chat.find({});
    for (const chat of found) {
        const { name, _id: id } = chat;
        const lastMessage = chat.messages[chat.messages.length - 1];
        chats.push({ id, name, lastMessage })
    }
    res.send(JSON.stringify(chats))
}));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});