const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    message: { type: String, required: true },
    ownerId: { type: mongoose.ObjectId, required: true },
    date: { type: Date, required: true },
})

module.exports = messageSchema;