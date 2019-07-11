const userModel = require('../tempModel').model('User');
const groupModel = require('../tempModel').model('Group');
const conversationModel = require('../tempModel').model('Conversation');

const createConversation = function(conversationId){
    const newConversation = new conversationModel();
    newConversation.id = conversationId;
    newConversation.members = [];
    return newConversation;
};

const createUser = function(vkId, name, sex){

    const user = new userModel();
    user.id = vkId;
    user.name = name;
    user.state = 0;
    user.group = sex;

    return user;
};

const addUserToConversation = async function(conversationId, vkId, name, sex){
    let conversation = await conversationModel.findOne({id: conversationId});
    const user = createUser(vkId, name, sex);
    if (!conversation){
        conversation = createConversation(conversationId);
    }
    conversation.members.push(user);
    return conversation.save();
};

const getUser = async function(conversationId, vkId){
    const conversation = await conversationModel.findOne({id: conversationId});
    if (!conversation){
        return {conversation: null, user: null};
    }
    return {conversation: conversation, user: conversation.members.find((item)=>{return item.id===vkId;})};
};


const kickGirl = async function(conversationId, handler){

    const conversation = await conversationModel.findOne({id: conversationId});
    if (!conversation){
        return;
    }

    const girls = conversation.members.filter((item)=>item.group===1);

    if (!girls){
        return;
    }

    console.log(girls.length);
    const ind = Math.random()*girls.length;
    const girl = girls[Math.floor(ind)];
    girl.score++;
    conversation.save();

    handler(girl.name, girl.score);
};


const addGroup = function(id, phrases, image){
    const group = new groupModel();
    group.id = id;
    group.phrases = phrases;
    group.imageURI = image;
    group.len = phrases.len;
    group.save();
};

const getGroup = function(id){
    return groupModel.findOne({id: id});
};

module.exports.addUser = addUserToConversation;
module.exports.addGroup = addGroup;
module.exports.getUser = getUser;
module.exports.getGroup = getGroup;
module.exports.kickGirl = kickGirl;

