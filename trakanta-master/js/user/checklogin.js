var express = require('express')
var router = express.Router()
const uri = process.env.url;
var moment = require('moment'); // require

const {
  MongoClient
} = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const axios = require('axios')


router.post('/login', function(req, res) {
  var user;
  async function CheckUser(){
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    try {
      await client.connect();
      const database = client.db("Trakanta");
      const collection = database.collection("user");
      const Loguser = await collection.findOne({
        username: req.body.username
      });
      user = Loguser
      console.log(Loguser)
      if(Loguser.password===req.body.password){
        req.session.role = 'admin';
      }
    }finally {
      insertUserLog();
      await client.close();
    }
  }

  async function insertUserLog() {

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    try {
      await client.connect();
      const database = client.db("Trakanta");
      const collection = database.collection("Loguser");
      // create a document to be inserted
      var datenow = moment().format("D/MM/YYYY hh:mm:ss");
      const doc = {
        userID: user.name,
        action: 'เข้าสู่ระบบ',
        date: datenow,
      };
      let session = req.session
      session.name = user.name;
      session._id = user._id;
      // const doc = { auth: sender, chat: text};
      const result = await collection.insertOne(doc);
    } finally {
      res.redirect('/home')
      await client.close();
    }
  }
  CheckUser()
  console.log(req.body);
})
router.get('/home', function(req, res) {
      if(req.session.role==='admin'){
        console.log('admin')
      }
})
router.get('/signout', (req, res) => {
  let session = req.session
   const name = session.name;
   console.log(name)
   insertUserLog()
   async function insertUserLog() {

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    try {
      await client.connect();
      const database = client.db("Trakanta");
      const collection = database.collection("Loguser");
      // create a document to be inserted
      var datenow = moment().format("D/MM/YYYY hh:mm:ss");
      const doc = {
        userID: name,
        action: 'ออกจากระบบ',
        date: datenow,
      };
      // const doc = { auth: sender, chat: text};
      const result = await collection.insertOne(doc);
    } finally {
      req.session.destroy();
      
      await client.close();
    }
  }
  res.redirect('/home')
  // res.redirect('home')
})
router.post('/', function (req, res, next) {
  req.session.phone = '';
  console.log(req.body)
  async function checklogin() {
    console.log('ตรวจ')

    req.session.userid = req.body.userId;
    console.log("To : " + req.session.userid)
    const user_name = req.body.name;
    const user_Id = req.body.userId;
    const user_email = req.body.email;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const database = client.db("KruaZapp");
      const collection = database.collection("user");
      const Loguser = await collection.find({
        userID: user_Id
      });

      if (Loguser == "") {
        console.log("ข้อมูลไม่ซ้ำ")
        InsertUser(user_name, user_Id, user_email).catch(console.dir);
        res.status(200).send({
          error: "boo :("
        });
      } else {
        let session = req.session
        session._id = user_Id;
        session.status = Loguser[0].status;
        session.role = Loguser[0].role;
        // var a = "10-05-2020";
       
        if (Loguser[0].expdate != '') {
          var eeexx = moment(Loguser[0].expdate, "DD-MM-YYYY").fromNow();
          var expstatus = eeexx.substring(eeexx.length - 3, eeexx.length);
          session.expdate = Loguser[0].expdate;
          console.log(Loguser)
          console.log('---------------------------------------');
          console.log(eeexx);
          console.log('---------------------------------------');
          if (!eeexx) {
            session.countdown = 'end';
          } else if (expstatus == "ago") {
            session.countdown = 'end';
          } else {
            session.countdown = eeexx;
          }
        }
        else{
          session.countdown = 'end';
        }
        session.phone = Loguser[0].phone;
        if(Loguser[0].phone){
          res.status(200).send({
            error: "boo :("
          });
        }
        console.log("ข้อมูลซ้ำ" + " role : " + req.session.role)
        res.status(200).send({
          error: "boo :("
        });
      }
    } finally {
      await client.close();
    }
  }
  checklogin();
  async function InsertUser(name, userId, email, next) {

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    try {
      await client.connect();
      const database = client.db("KruaZapp");
      const collection = database.collection("user");
      // create a document to be inserted
  
      const doc = {
        userID: userId,
        email: email,
        name: name,
        phone: "",
        role: "member",
        point: 0,
        status: 0,
        expdate: ""
      };
      let session = req.session
      session._id = userId;
      session.expdate = "";
      // const doc = { auth: sender, chat: text};
      const result = await collection.insertOne(doc);
    } finally {
      // res.redirect("/page");
      await client.close();
    }
  }
})


module.exports = router