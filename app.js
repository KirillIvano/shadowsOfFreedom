const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');
require('./db');
const api = require('./routes/api');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
require('./vk/vkLifeCycle');

app.use('/api', api);
process.addListener('disconnect', function(err){
    console.log(err);
});
module.exports = app;
