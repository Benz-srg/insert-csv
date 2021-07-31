var express = require('express')
var router = express.Router()
const { MongoClient } = require("mongodb")
var ObjectId = require('mongodb').ObjectId
var moment = require('moment')
const uri = process.env.url;
const axios = require('axios');

router.get("/", function (req, res) {

      res.render('logchat');
});
  
router.get("/coupon-form", function (req, res) {
    res.render("test/coupon-form");
});
router.post("/insert", (req, res) => {
    console.log("-------------------------")
    console.log(req.body);
    console.log("-------------------------")
});
async function Getuser(id) {
    let res = await axios.get('https://api.line.me/v2/bot/profile/'+ id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ 'LwDOyRNKAwNiXqqctp7gp6mpjw4fMQszT4LVQQPLtEZe0mfhUpcmCfKIC1GBHI2HRHFQWJJCicpLcL6CuJH5p8Xry2OGoo7SMXAEMnmei4gJmzy/MkpsCdISZ+vku86AgtnmDvPqN2uj3CchcvdnegdB04t89/1O/w1cDnyilFU='
      }
    })
    .then((res) => {
      user_pic=res.data.pictureUrl;
      Displayname=res.data.displayName;
    })
    .catch((error) => {
      console.error(error)
    })
  }
module.exports = router 