const getImageAndSaveIt = require('./../getPhoto');
const albumsManager = require('./../../databaseFunctions/albums');

module.exports.start = function(admin, item){
    admin.state = 'album_image';
    admin.album = albumsManager.create();
    admin.album.id = Date.now();
    return 'Пришлите обложку альбома!';
};

module.exports.handlePhoto = function(admin, item){
    try{
        return getImageAndSaveIt(admin, item, 'album_name', 'album');
    }catch (err){
        return 'Извините , у нас тут ошибка';
    }
};

module.exports.handleName = function(admin, item){
    admin.state = 'album_songs';
    admin.album.name = item.object.text;
    return 'Имя добавлено, пришлите названия песен, разделяя их переносом строки';
};

module.exports.handleSongs = function(admin, item){
    admin.state = 'album_approve';
    admin.album.songs = item.object.text.split('\n');
    let message = 'Это та информация, которую вы хотите опубликовать?\n';
    message += `Название: ${admin.album.name}\nПесни: \n`;
    admin.album.songs.forEach((item)=>message+=item+'\n');
    return message;
};

module.exports.handleApprove = function(admin, item){
    admin.state = 'init';

    if (item.object.text==='нет'){
        return 'Отменяем...';
    }

    const album = albumsManager.create();
    album.songs = admin.album.songs;
    album.image = admin.album.image;
    album.name = admin.album.name;
    album.id = admin.album.id;
    album.save();
    
    delete admin.album;
    return 'Альбом успешно добавлен!';
};



