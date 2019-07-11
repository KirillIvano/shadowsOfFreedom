const checkIfJpg = function(url){
    return /https:\/\/pp.userapi.com\/.*\.jpg/.test(url);
};

module.exports.checkIfJpg = checkIfJpg;
