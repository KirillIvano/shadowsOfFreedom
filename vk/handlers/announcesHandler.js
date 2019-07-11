const announcesManager = require('./../../databaseFunctions/announces');
const moment = require('moment');
module.exports.start = function(admin){
    admin.state = 'announce_headline';
    admin.announce = announcesManager.create();
    admin.announce.id = Date.now();
    return 'Введите заголовок новости!';
};

module.exports.handleHeadline = function(admin, item){
    admin.state = 'announce_text';
    admin.announce.headline = item.object.text;
    return 'Введите текст новости!';
};

module.exports.handleContent = function(admin, item){
    admin.state = 'announce_approve';
    admin.announce.content = item.object.text;
    return 'Это та информация, которую вы хотите опубликовать?\nЗаголовок: ' + admin.announce.headline + '\nСодержание: ' + admin.announce.content;
};

module.exports.handleApprove = function(admin, item){
    admin.state = 'init';

    if (item.object.text==='нет'){
        return 'Отменяем...';
    }

    const announce = announcesManager.create();
    announce.content = admin.announce.content;
    announce.headline = admin.announce.headline;
    announce.date = moment().format('YYYY MM DD');
    announce.save();

    delete admin.announce; 
    return 'Новость успешно добавлена!';
};
