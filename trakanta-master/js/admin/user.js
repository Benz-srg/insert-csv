var express = require('express')
var router = express.Router()
const axios = require('axios')
const moment = require('moment')
const uri = process.env.url;
const {
  MongoClient
} = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
var User = require("../../model/user_model");
var Loguser = require("../../model/loguser_model");
var user;
var user_data = [];


router.post('/edit', function (req, res) {
  const id = req.body.id
  const userid = req.body.userid
  const name = req.body.name
  const email = req.body.email
  const telno = req.body.telno
  const username = req.body.username
  const password = req.body.password
  
  async function editUser() {

    try {

      // create a document to be inserted

      var query = {
        _id: ObjectId(id)
      };
      var value = {
        $set: {
          userid:userid,
          name: name,
          email: email,
          telno: telno,
          password: password,
        },
      };
      const result = await User.updateOne(query, value);
    } finally {
      res.redirect('/user?alert=edit-success')
    }
  }
  editUser();
})


router.get('/edit/:id', function (req, res) {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  if (req.session.role == "Admin") {
    Getorder();
  } else if (req.session.role == "HR") {
    Getorder();
  } else if (req.session.role == "Packing") {
    Getorder();
  } else if (req.session.role == "Sale Admin") {
    Getorder();
  } else if (req.session.role == "Owner") {
    Getorder();
  } else if (req.session.role == "Data Analyst") {
    Getorder();
  } else {
    res.redirect("/login");
  }
  if (req.session.role != "admin") {
    return res.redirect("/home");
  }
  // if (req.session.role == "admin") {
  // //   return res.redirect("/home");
  // }else{
  //     console.log(req.session.role + " != admin" )
  //     return res.redirect("/home");
  // }

  id = req.params.id;
  console.log('role :' + req.session.role + " id :" + id)

  async function checkUser() {


    try {
      await client.connect();
      const database = client.db("KruaZapp");
      const collection = database.collection("coupon");


      const Loguser = await collection.find({
        userID: id
      });

      if (!Loguser) {
        res.redirect("/home");
      } else {
        await Getuser(id)
        console.log(Loguser)
        res.render("admin/edit_user", {
          status: true,
          data: Loguser,
          pic: user_data,
          role:role,
          username:username,
          id: Loguser[0]._id
        });
      }
    } catch (err) {
      console.log(err);
    } finally {

    }
  }
  async function Getuser(id) {
    let tes = await axios.get('https://api.line.me/v2/bot/profile/' + id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + 'LwDOyRNKAwNiXqqctp7gp6mpjw4fMQszT4LVQQPLtEZe0mfhUpcmCfKIC1GBHI2HRHFQWJJCicpLcL6CuJH5p8Xry2OGoo7SMXAEMnmei4gJmzy/MkpsCdISZ+vku86AgtnmDvPqN2uj3CchcvdnegdB04t89/1O/w1cDnyilFU='
        }
      })
      .then((res) => {
        // user_data += res.data.pictureUrl
        user_data = res.data.pictureUrl;
        console.log("user_data is : " + user_data)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  // res.render('admin/page_user');
  checkUser()

})


router.get('/', function (req, res) {
  // if (req.session.role != "admin") {
  //   return res.redirect("/home");
  // }
  // const id = req.params.id;
  var user
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  if (req.session.role == "Admin") {
    Getorder();
  } else if (req.session.role == "HR") {
    Getorder();
  } else if (req.session.role == "Packing") {
    Getorder();
  } else if (req.session.role == "Sale Admin") {
    Getorder();
  } else if (req.session.role == "Owner") {
    Getorder();
  } else if (req.session.role == "Data Analyst") {
    Getorder();
  } else {
    res.redirect("/login");
  }
  
  async function Getorder() {

    try {
      const result = await User.find();
      user = result;
    } catch (err) {
      console.log(err);
    } finally {
      
      console.log(user)
      res.render("admin/manage_user", {
        data: user,
        role:role,
        username:username,
        moment
      });
    }
  }
})

router.get('/:id', function (req, res) {
  var id = req.params.id;
  var user;
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  if (req.session.role == "Admin") {
    getUser();
  } else if (req.session.role == "HR") {
    getUser();
  } else if (req.session.role == "Packing") {
    getUser();
  } else if (req.session.role == "Sale Admin") {
    getUser();
  } else if (req.session.role == "Owner") {
    getUser();
  } else if (req.session.role == "Data Analyst") {
    getUser();
  } else {
    res.redirect("/login");
  }
  getUser()
  async function getUser() {

    try {
      const result = await User.findOne({
        _id: ObjectId(id)
      });
      user = result;
    } catch (err) {
      console.log(err);
    } finally {
      console.log(user);
      res.render("admin/edit_user", {
        data: user,
        role:role,
        username:username,
        moment
      });
    }
  }
})

router.get('/del/:id', function (req, res) {
  var id = req.params.id;
  var check;

  getUser()
  async function getUser() {

    try {
      const result = await User.findOne({
        username: id
      });
      check = result;
    } catch (err) {
      console.log(err);
    } finally {

      
      console.log('=============')
      console.log(check)
      if (check == null) {
        res.redirect("/user?alert=error-unusername");
      } else {
        delUser()
      }
    }
  }
  async function delUser() {

    try {
      const result = await User.deleteOne({
        username: id
      });
    } finally {
      res.redirect("/user?alert=delete-success");
    }
  }
})
router.post('/createuser', function (req, res) {
  var check;
  // console.log(req.body)
  const name = req.body.name
  const email = req.body.email
  const telno = req.body.telno
  const role = req.body.role
  const username = req.body.username
  const password = req.body.password
  getUser()
  async function getUser() {

    try {
      const result = await User.findOne({
        username: username
      });
      check = result;
    } catch (err) {
      console.log(err);
    } finally {

      
      console.log('=============')
      console.log(check)
      if (check == null) {
        createUser()
      } else {
        res.redirect("/user?alert=error-username");
      }

      // res.status(500).json({
      //   isConnected: false
      // });
    }
  }
  async function createUser() {

    try {

     
      // create a document to be inserted
      const doc = {
        name: name,
        email: email,
        telno: telno,
        username: username,
        password: password,
        role: role,
        date: new Date(),
      };
      const result = await User.create(doc);
    } finally {
      res.redirect("/user?alert=create-success");
    }
  }

})
module.exports = router