var express = require('express')
var router = express.Router()
const axios = require('axios')
const { MongoClient } = require("mongodb")
var ObjectId = require('mongodb').ObjectId
var moment = require('moment')
const querystring = require('querystring');

router.get('/',function(req,res){
    res.render('reserveform');
  })
router.post('/add',function(req,res){
    console.log(req.body)
    // const name = req.body.name;
    // const typecourse = req.body.typecourse;
    // const date = req.body.date;
    // const detail = req.body.detail;
    // const time = req.body.time;
    // const pic = req.body.pic;
    // const phone = req.body.phone;
    // const amount = req.body.amount
    // sendNotic(name,typecourse,date,detail,time,pic,phone,amount)
    // InsertUser(req.body.name,req.body.userId,req.body.email)
})




async function sendNotic(name,typecourse,date,detail,time,pic,phone,amount) {
    var d = new Date(date);
    var t = new Date(time);
    let day = ("0" + d.getDate()).slice(-2);let month = ("0" + (d.getMonth() + 1)).slice(-2);let year = d.getFullYear();
    const fdate = day + "/" + month + "/" + year;
    let hours = t.getHours();let minutes = t.getMinutes();let seconds = t.getSeconds();
    const ftime = hours + ":" + minutes + ":" + seconds;
      var datamsgg = "มีข้อความเข้าจาก Liff KruaZapp เข้ามาค่ะ \nจากคุณ : " + name + " \nเบอร์ติดต่อ : "+ phone +"\nจองโต๊ะวันที่ : " + 
      fdate + "\nเวลา : "+ftime+ " \nจำนวน : " + amount + " ท่าน"+
      "\nจองคอร์ส : "  + typecourse + " \nรายละเอียด : "+ detail;
      
      axios({
        method: 'post',
        url: 'https://notify-api.line.me/api/notify',
        headers: {
          'Authorization': 'Bearer ' + '1D2NqMTyVErCbcpB0g_BkQTAvZy35oCShWvciCRpwuZE',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Access-Control-Allow-Origin': '*'
        },
        data: querystring.stringify({
          message: datamsgg,
        })
      })
      // console.log(Loguser);
      
    
  }
async function InsertReserve(name,userId,email) {

const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});

try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("reserve");
    // create a document to be inserted
    const doc = { userID: userId , email:email , name:name};
    // const doc = { auth: sender, chat: text};
    const result = await collection.insertOne(doc);
    console.log(
    `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
    );
} finally {
    await client.close();
}
}
module.exports = router 


