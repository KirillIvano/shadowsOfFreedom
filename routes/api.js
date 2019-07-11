const router = require('express').Router();
const albums = require('./../databaseFunctions/albums');
const announces = require('./../databaseFunctions/announces');
const goods = require('./../databaseFunctions/goods');

router.get('/getAlbums', async function(req, res){
    res.send(await albums.getAll());
});

router.get('/getAnnounces', async function(req, res){
    res.send(await announces.getAll());
});

router.get('/getGoods', async function(req, res){
    res.send(await goods.getAll());
});

module.exports = router;