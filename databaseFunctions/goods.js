const goodModel = require('./../models').model('Good');

module.exports.create = function(){
    return new goodModel();
};

module.exports.get = function(id){
    return goodModel.findOne({id: id});
};

module.exports.getAll = function(){
    return goodModel.find();
};

module.exports.remove = function(){
    return goodModel.remove({id: id});
};