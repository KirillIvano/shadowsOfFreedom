const mongoose = require('mongoose');
require("./models.js");
let dbURI = 'mongodb://127.0.0.1:27017/database';


if (process.env.NODE_ENV==="production"){
    console.log("v production");
    dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.connection.on("connected", function(){
    console.log("Connected, man");
});

mongoose.connection.on("error", function(e){
    console.log(e);
    console.log("Error, man");
});

mongoose.connection.on("disconnected", function(){
    console.log("No connection, man");
});

// close db connection before exiting 
const gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Disconnected with' + msg);
        callback();
    });
};

// exits in WIN and Heroku

process.on("SIGINT", function(){
    gracefulShutdown("Process terminated", function(){
        process.exit(0);
    });
});

process.on("SIGTERM", function(){
    gracefulShutdown("Heroku terminated", function(){
        process.exit(0);
    });
});