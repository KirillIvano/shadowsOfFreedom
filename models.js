const mongoose = require('mongoose');

const Admin = mongoose.Schema({
    id: Number,
    log: {type: String, default: ''}
});

const Good = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    key: String
});

const NewsItem = mongoose.Schema({
    title: String,
    content: String,
    date: String,
    key: String
});

const Album = mongoose.Schema({
    name: String,
    songs: [String],
    key: String
});

mongoose.model('Admin', Admin);
mongoose.model('Good', Good);
mongoose.model('NewsItem', NewsItem);
mongoose.model('Album', Album);

module.exports = mongoose;