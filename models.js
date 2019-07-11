const mongoose = require('mongoose');

const Good = mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
});

const Announce = mongoose.Schema({
    id: Number,
    headline: String,
    content: String,
    date: String
});

const Album = mongoose.Schema({
    id: Number,
    name: String,
    songs: [String],
});

const Admin = mongoose.Schema({
    id: Number,
    state: {type: String, default: 'init'},
    log: {type: String, default: ''},
    album: Album,
    announce: Announce,
    good: Good
});

mongoose.model('Admin', Admin);
mongoose.model('Good', Good);
mongoose.model('Announce', Announce);
mongoose.model('Album', Album);

module.exports = mongoose;