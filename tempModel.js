const mongoose = require('mongoose');

const Group = mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    phrases: [String],
    len: {type: Number, default: 0},
    imageURI: String
});

const User = mongoose.Schema({
    id: Number,
    name: String,
    state: Number,
    group: Number,
    score: {type: Number, default: 0},
});

const Conversation = mongoose.Schema({
    id: {type: Number, required: true},
    members: [User]
});

mongoose.model('User', User);
mongoose.model('Group', Group);
mongoose.model('Conversation', Conversation);

module.exports = mongoose;