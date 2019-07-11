const announceModel = require('./../models').model('Announce');

module.exports.create = function(){
    return new announceModel();
};

module.exports.get = function(id){
    return announceModel.findOne({id: id});
};

module.exports.getAll = function(){
    return announceModel.find();
};

module.exports.remove = function(){
    return announceModel.remove({id: id});
};