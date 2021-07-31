var express = require('express')
var router = express.Router()
const uri = process.env.url;
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const axios = require('axios')
var user;
var user_data =[];
router.get('/:id',function(req,res){
    const id = req.params.id;

    
async function checkUser() {
  
    const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
    try {
      await client.connect();
      const database = client.db("KruaZapp");
      const collection = database.collection("user");


      const Loguser = await collection.find({userID:id});

      if(Loguser=="")
      {
        res.redirect("/home");
      }else
      {
        find();
      }
    }catch (err) {
        console.log(err);
    } 
    finally {
      await client.close();
    }
  }
  async function find() {
    const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
    try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("member");
    const result = await collection.find({userID:id});
      user = result;
    } catch (err) {
      console.log(err);
    } finally {
      var text
      for (var i = 0; i < user.length; i++) {
        await Getuser(user[i].userID);
        text += user[i].userID + "<br>";
      };
      //res.json({ status: true, data: bank })
      console.log(user)
      console.log(user_data)
      res.render("user/page_member", { status: true, data: user ,pic:user_data });
    }
  }
  
    // res.render('admin/page_user');
    checkUser()
    user_data = [];
})

async function Getuser(id) {
  let res = await axios.get('https://api.line.me/v2/bot/profile/'+ id, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ 'LwDOyRNKAwNiXqqctp7gp6mpjw4fMQszT4LVQQPLtEZe0mfhUpcmCfKIC1GBHI2HRHFQWJJCicpLcL6CuJH5p8Xry2OGoo7SMXAEMnmei4gJmzy/MkpsCdISZ+vku86AgtnmDvPqN2uj3CchcvdnegdB04t89/1O/w1cDnyilFU='
    }
  })
  .then((res) => {
    // user_data += res.data.pictureUrl
    user_data.push(res.data.pictureUrl);
    // console.log(res.data)
  })
  .catch((error) => {
    console.error(error)
  })
}

module.exports = router

