require('../db');
const dbMethods = require('./vkDataBase');
const request = require('request-promise-native');
const vkReturner = require('../vk/VkAPIReturner');
const api = new vkReturner.vkClass('community', '3b2594a28d5c9dedd10fdc6ef3559e7975fb130b05182575011bb9215eb46b8d0d6085c81f153d56eea34');
const getLongPoll = api.createMethod('groups.getLongPollServer');
const send = api.createMethod('messages.send');
const getUserFromApi = api.createMethod('users.get');
const getGender = require('../util/getGender');
const getUserFromDataBase = require('./../databaseFunctions/userFind');

const getServerInfo = async function(groupId){
    const data = await getLongPoll({group_id: groupId});
    const parsedData = JSON.parse(data);
    if (!parsedData.response){
        throw new Error(parsedData.error);
    }
    return parsedData.response;
};

const startLongpolling = async function(){
    let {key,server,ts} = await getServerInfo(183400418);

    while(true){
        
        const response = await request({
            method: 'GET',
            url: `${server}?act=a_check&key=${key}&ts=${ts}&wait=25`
        });

        const parsedResponse = JSON.parse(response);
        
        if (parsedResponse.failed){
            switch(parsedResponse.failed){
                case 1:
                    ts = parsedResponse.ts;
                    break;
                case 2:
                    key = await getServerInfo(183400418).key;
                    break;
                case 3:
                    const newData = await getServerInfo(183400418);
                    key = newData.key;
                    ts = newData.ts;
                    break;
            }
            continue;
        }

        if (!parsedResponse.updates || !parsedResponse.updates.length){
            continue;
        }

        let chatId = parsedResponse.updates[0].object.peer_id;

        parsedResponse.updates.forEach(async (item, index)=>{
            if (item.type === 'message_new'){
                console.log(item.object.attachments[0].photo.sizes[0]);

                // handle special commands 
                if (item.object.text.toLowerCase()==='ббпе'){
                    dbMethods.kickGirl(chatId, function(name, time){
                        send(
                            {
                                message: name + ' получила по ебалу уже ' + time + ' раз!',
                                peer_id: chatId,
                                attachment: 'photo-183400418_456239020',
                                random_id: Date.now()
                            }
                        );
                    });
                    return;
                }

                let message;
                let attachment = 'photo-183400418_456239019';
                
                const vkId = item.object.from_id;

                // conversation is returned to commit changes
                let {conversation, user} = await dbMethods.getUser(chatId, item.object.from_id);

                if (!user){

                    user = JSON.parse(await getUserFromApi({user_ids: [item.object.from_id], fields: ['sex']}));
                    if (!user.response.length){
                        return;
                    }
                    // don't need to wait for saving
                    dbMethods.addUser(chatId, vkId, user.response[0].first_name + ' ' + user.response[0].last_name, user.response[0].sex);
                    message = 'hello, блять!'; 
                }else{
                    if (!user.points){
                        user.points = 0;
                    }
                    const group = await dbMethods.getGroup(user.group);
                    if (!group){
                        message = 'нахуй всех';
                    }else{
                        if (group.phrases.length !== 0){
                            user.state = (user.state + 1) % group.phrases.length;
                        }
                        message = group.phrases[user.state];
                        attachment = group.imageURI;
                        conversation.save();
                    }
                }

                send({message: message, peer_id: chatId, attachment: attachment, random_id: Date.now()});
            }
        });

        ts = parsedResponse.ts;
    }  
};

startLongpolling();