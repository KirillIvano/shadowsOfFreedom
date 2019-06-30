const router = require('express').Router();

router.post('callback', function(req, res){
    if (req.body){
        if (req.body.type==='confirmation'){
            res.status(200);
            res.send('7437ea3d');
            return;
        }
        res.status(200);
        res.send('ok');
    }
});
module.exports = router;