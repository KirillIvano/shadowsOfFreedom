const fs = require('fs');
const request = require('request-promise-native');

const addImage = async function(url, id){
    const file = await request({
        url: url,
        headers: {'content-type': 'image/jpg'},
        method: 'GET',
        encoding: null
    });
    return new Promise(function(resolve){
        fs.writeFile(__dirname + `/../images/${id}.jpg`, file, (err)=>{console.log(err);resolve(err);});
    });
};

module.exports = addImage;