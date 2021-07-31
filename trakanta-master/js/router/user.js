var express = require('express')
var router = express.Router()
const uri = process.env.url;
var moment = require('moment'); // require
var User = require("../../model/user_model");
var Log_user = require("../../model/loguser_model");
var ObjectId = require("mongodb").ObjectId;

require('dotenv').config()
const axios = require('axios')

router.post('/login', function(req, res) {
  var user;
  var role;
  var username;
  async function CheckUser(){
    try {
      const Loguser = await User.findOne({
        username: req.body.username
      });
      user = Loguser
      if(Loguser.password===req.body.password){
        role = Loguser.role;
        username = Loguser.username
      }else{
        res.redirect('/login?alert=password-fail')
      }
    }finally {
      req.session.role=role;
      req.session.username=username;
        // console.log(user)
      insertUserLog();
    }
  }

  async function insertUserLog() {
    try {
      // create a document to be inserted
      var datenow = moment().format("D/MM/YYYY hh:mm:ss");
      const doc = {
        userID: user.name,
        action: 'เข้าสู่ระบบ',
        date: new Date(),
      };
      let session = req.session
      session.name = user.name;
      session._id = user._id;
      // const doc = { auth: sender, chat: text};
      const result = await Log_user.create(doc);
      console.log(result)
    } finally {
      console.log("test : "+req.session.role)
      res.redirect('/app')
    }
  }
  CheckUser()
  // console.log(req.body);
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
   insertUserLog();
   async function insertUserLog() {
    try {
      // create a document to be inserted
      var datenow = moment().format("D/MM/YYYY hh:mm:ss");
      const doc = {
        userID: user.name,
        action: 'ออกจากระบบ',
        date: datenow,
      };
      let session = req.session
      session.name = user.name;
      session._id = user._id;
      // const doc = { auth: sender, chat: text};
      const result = await Log_user.create(doc);
      console.log(result)
    } finally {
      res.redirect('/login')
    }
  }
  
  // res.redirect('home')
})


module.exports = router
