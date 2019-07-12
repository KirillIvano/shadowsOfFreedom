const helpers = require('./../helpers');
// const saveImage = require('./getImageToServer');

const isNearlySquare = ({width: w, height: h}) => (Math.abs(w-h) < Math.min(w, h)/20);

module.exports = async function(admin, item, state, type){
    const attachmentNum = item.object.attachments.length;
    if (attachmentNum){
        const attachment = item.object.attachments.find((att)=>att.type==='photo');
        if (attachment){
            const lastImage = attachment.photo.sizes[attachment.photo.sizes.length-1];
            const photoURL = lastImage.url;
            if (!isNearlySquare(lastImage)){
                return 'У фотографии плохой формат, она должна быть квадратной формы';
            }
            if (helpers.checkIfJpg(photoURL)){
                // await saveImage(photoURL, admin[type].id);
                admin[type].image = photoURL;
                admin.state = state;
                return 'Фотография успешно добавлена!\n Введите название!';
            }
        }
    }
    return 'Вы прислали не фотографию!';
};