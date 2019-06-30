const Admin = require('./../models').model('Admin');

module.exports = function(id){
    const admin = new Admin();
    admin.id = id;
    return admin.save().then(function(data){
        if (!data){
            throw new Error('error occured while saving admin'); 
        }else{
            return data;
        }
    }).catch((err)=>console.log(err));
};