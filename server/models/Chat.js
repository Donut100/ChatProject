const mongoose = require("mongoose");
const MessageSchema = require("./Message");
const chatSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.ObjectId,
        require: true,
    },
    name: {
        type: String,
        required: true,
    },
    messages: {
        type: [MessageSchema],
        default: []
    }
})

const chat = mongoose.model('Chat', chatSchema);
module.exports = chat;