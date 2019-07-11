const albumModel = require('./../models').model('Album');

module.exports.create = function(){
    return new albumModel();
};

module.exports.get = function(id){
    return albumModel.findOne({id: id});
};

module.exports.getAll = function(){
    return albumModel.find();
};

module.exports.remove = function(){
    return albumModel.remove({id: id});
};