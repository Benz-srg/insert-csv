var express = require('express')
var router = express.Router()



router.get('/',function(req,res){
    if(req.session.role == ''){
        res.redirect('/home');
    }
    res.render('page')
})

module.exports = router 