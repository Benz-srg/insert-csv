var express = require('express')
var router = express.Router()

router.get('/:id',function(req,res){
    const id = req.params.id;

    res.render('showimg',{id:id})
    console.log(id)
})
router.get('/show/:id',function(req,res){
    const id = req.params.id;
    
    res.send('<img src="/images/logo/'+id+'" width="30%" height="auto"/>')
    console.log(id)
  })

module.exports = router 