const request = require('request-promise-native');
const vkReturner = require('../vk/VkAPIReturner');
const api = new vkReturner.vkClass('community', '696f32599c2e92e4fd6fb3913b54b98214b42ad727a0055642a22a94db8c855a84aa1c804809a98bf7c72');
const getLongPoll = api.createMethod('groups.getLongPollServer');
const send = api.createMethod('messages.send');
const getAdminFromDatabase = require('./../databaseFunctions/userFind')().get;
const generateKeyboard = require('./generateButtonsForState');
const albumsHandler = require('./handlers/albumsHandler');
const announcesHandler = require('./handlers/announcesHandler');
const goodsHandler = require('./handlers/goodsHandler');


const getServerInfo = async function(groupId){
    const data = await getLongPoll({group_id: groupId});
    const parsedData = JSON.parse(data);
    if (!parsedData.response){
        throw new Error(parsedData.error);
    }
    return parsedData.response;
};

const startLongpolling = async function(groupId){
    let {key,server,ts} = await getServerInfo(groupId);

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
                    key = await getServerInfo(groupId).key;
                    break;
                case 3:
                    const newData = await getServerInfo(groupId);
                    key = newData.key;
                    ts = newData.ts;
                    break;
            }
            continue;
        }

        if (!parsedResponse.updates || !parsedResponse.updates.length){
            continue;
        }


        parsedResponse.updates.forEach(async (item, index)=>{
            if (item.type === 'message_new'){                
                const vkId = item.object.from_id;
                let message = '';
                const admin = await getAdminFromDatabase(vkId);
                console.log(admin);
                if (admin){
                    if (item.object.text==='вернуться'){
                        admin.state = 'init';
                        await admin.save();
                    }
                    switch (admin.state){
                        case 'init':
                            switch(item.object.text){
                                case 'новость':
                                    message = announcesHandler.start(admin);
                                    break;   
                                case 'альбом':
                                    message = albumsHandler.start(admin);
                                    break;
                                case 'товар':
                                    message = goodsHandler.start(admin);
                                    break;
                                // case 'контакт':
                                //     admin.state = 'contact_name';
                                //     break;
                                default: 
                                    message = 'Не понимаю вас , товарищ, воспользуйся кнопками!';
                            }
                            break;

                        case 'album_image':
                            message = await albumsHandler.handlePhoto(admin, item);
                            break;

                        case 'album_name':
                            message = albumsHandler.handleName(admin, item);
                            break;

                        case 'album_songs':
                            message = albumsHandler.handleSongs(admin, item);
                            break;

                        case 'album_approve':
                            message = albumsHandler.handleApprove(admin, item);
                            break;

                        case 'announce_headline':
                            message = announcesHandler.handleHeadline(admin, item);
                            break;

                        case 'announce_text':
                            message = await announcesHandler.handleContent(admin, item);
                            break;
                        case 'announce_approve':
                            message = announcesHandler.handleApprove(admin, item);
                            break;
                        case 'good_image':
                            message = await goodsHandler.handlePhoto(admin, item);
                            break;

                        case 'good_name':
                            message = goodsHandler.handleName(admin, item);
                            break;

                        case 'good_price':
                            message = goodsHandler.handlePrice(admin, item);
                            break;

                        case 'good_approve':
                            message = goodsHandler.handleApprove(admin, item);
                            break;
                    };
                    await admin.save();
                    await send({message: message, keyboard: JSON.stringify(generateKeyboard(admin.state)), peer_id: vkId, random_id: Date.now()});
                }
            }
                // conversation is returned to commit changes
               
            //     const group = await dbMethods.getGroup(user.group);
            //     if (!group){
            //         message = 'нахуй всех';
            //     }else{
            //         if (group.phrases.length !== 0){
            //             user.state = (user.state + 1) % group.phrases.length;
            //         }
            //         message = group.phrases[user.state];
            //         attachment = group.imageURI;
            //         conversation.save();
            //     }

        });
        ts = parsedResponse.ts;
    }
};


startLongpolling(184111756);