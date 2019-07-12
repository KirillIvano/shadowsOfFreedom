const goodsManager = require('./../../databaseFunctions/goods');
const getImageAndSaveIt = require('./../getPhoto');

module.exports.start = function(admin, item ){
    admin.state = 'good_image';
    admin.good = goodsManager.create();
    admin.good.id = Date.now();
    return 'Пришлите фотографию товара!';
};

module.exports.handlePhoto = function(admin, item){
    return getImageAndSaveIt(admin, item, 'good_name', 'good');
};

module.exports.handleName = function(admin, item){
    admin.state = 'good_price';
    admin.good.name = item.object.text;
    return 'Имя добавлено, введите цену!';
};

module.exports.handlePrice = function(admin, item){
    if (!Number.isInteger(parseInt(item.object.text))){
        return 'Цена должна быть целым числом!';
    }
    admin.state = 'good_approve';
    admin.good.price = parseInt(item.object.text);
    return 'Это та информация, которую вы хотите опубликовать?\nНазвание: ' + admin.good.name + '\nЦена: ' + admin.good.price;
};

module.exports.handleApprove = function(admin, item){
    
    admin.state = 'init';

    if (item.object.text==='нет'){
        return 'Отменяем...';
    }

    const good = goodsManager.create();
    good.price = admin.good.price;
    good.name = admin.good.name;
    good.image = admin.good.image;
    good.id = admin.good.id;
    good.save();

    delete admin.good;
    return 'Товар успешно добавлен!';
};
