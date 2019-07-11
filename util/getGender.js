const request = require('request-promise-native');

const getGender = async function(name){
    const data = await request({
        url: 'https://gender-api.com/get',
        method: 'get',
        qs: {
            key: 'RJCgoPHzCgGHambhgs',
            name: name
        }
    });
    return data.gender;
};
module.exports = getGender;