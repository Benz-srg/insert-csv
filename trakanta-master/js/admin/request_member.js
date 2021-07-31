var express = require('express')
var router = express.Router()
const moment= require('moment')
const uri = process.env.url;
const line = require('@line/bot-sdk');
const {
  MongoClient
} = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const axios = require('axios')
var user;
var user_data = [];

router.get('/', function (req, res) {
  if (req.session.role != "admin") {
    return res.redirect("/home");
  }
  console.log("test" + req.session.role)
  const id = req.params.id;
  if ('admin' == 'admin') {
    find();
  }


  async function find() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    try {
      await client.connect();
      const database = client.db("KruaZapp");
      const collection = database.collection("member");
      const result = await collection.find();
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
      res.render("member/page_user", {
        status: true,
        data: user,
        pic: user_data
      });
    }
  }

  // res.render('admin/page_user');
  // checkUser()
  user_data = [];
})
router.get('/insert/:id/:userid/:day',async function (req, res) {
  if (req.session.role != "admin") {
    return res.redirect("/home");
  }
  var id = req.params.id;
  var day = req.params.day;
  var userid = req.params.userid;
  var urilink = userid;
  console.log(id+" "+ userid+" "+day);
  await InsertReserve(id, userid, day);

  res.redirect("/member/list/?alert=update-success");
})
router.get('/edit/:id/:userid', function (req, res, next) {
  if (req.session.role != "admin") {
    return res.redirect("/home");
  }
  console.log("test" + req.session.test)
  var id = req.params.id;
  const userid = req.params.userid;
  var urilink = userid;

  editReserve(id, userid)
  res.redirect("/member/list/?alert=edit-success");
})

router.get('/delete/:id/:userid', function (req, res, next) {
  if (req.session.role != "admin") {
    return res.redirect("/home");
  }
  var id = req.params.id;
  const userid = req.params.userid;
  var urilink = userid;

  deleteReserve(id, userid)
  res.redirect("/member/list/?alert=delete-success");
})

async function Getuser(id) {
  let res = await axios.get('https://api.line.me/v2/bot/profile/' + id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'LwDOyRNKAwNiXqqctp7gp6mpjw4fMQszT4LVQQPLtEZe0mfhUpcmCfKIC1GBHI2HRHFQWJJCicpLcL6CuJH5p8Xry2OGoo7SMXAEMnmei4gJmzy/MkpsCdISZ+vku86AgtnmDvPqN2uj3CchcvdnegdB04t89/1O/w1cDnyilFU='
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

async function editReserve(id, userid) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("member");
    // create a document to be inserted

    var query = {
      _id: ObjectId(id)
    };
    var value = {
      $set: {

        status: 0,
      },
    };
    const result = await collection.updateOne(query, value);
  } finally {
    findUserid(userid, 'update')
    await client.close();
  }
}

async function deleteReserve(id, userid) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("member");
    // create a document to be inserted

    var query = {
      _id: ObjectId(id)
    };
    var value = {
      $set: {
        status: 3,
      },
    };
    const result = await collection.updateOne(query, value);

  } finally {
    await client.close();
  }
}
async function InsertReserve(id,userid,day) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const lineclient = new line.Client({channelAccessToken: process.env.lineurl});
  const message = {
    type: 'text',
    text: 'ยืนยันการสมัครสมาชิกเรียบร้อยแล้ว'
  };
  
  lineclient.pushMessage(userid, message)
  try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("member");
    // create a document to be inserted
    var query = {
      _id: ObjectId(id)
    };
    var value = {
      $set: {
        expdate: day,
        status: 1,
      },
    };
    const result = await collection.updateOne(query, value);

  } finally {
    findUserid(userid, 'insert',day)
    await client.close();
  }
}
async function findUserid(id, status,day) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("user");
    const result = await collection.find({
      userID: id
    });

    user = result;
  } catch (err) {
    console.log(err);
  } finally {
    
    if (status == 'update') {
      updateUser(user[0]._id)
    }
    if (status == 'insert') {
      InsertUser(user[0]._id,day)
    }

  }
}

async function updateUser(id,exp) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("user");
    // create a document to be inserted
    console.log(id)
    var query = {
      expdate: exp,
      _id: ObjectId(id)
    };
    var value = {
      $set: {
        status: 0,
      },
    };
    const result = await collection.updateOne(query, value);

  } catch (err) {
    console.log(err);
  } finally {
    // console.log('do')
    await client.close();
  }
}

async function InsertUser(id,day) {
  

  
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {

    await client.connect();
    const database = client.db("KruaZapp");
    const collection = database.collection("user");
    // create a document to be inserted
    console.log(id)
    var query = {
      _id: ObjectId(id)
    };
    var value = {
      $set: {
        expdate: day,
        status: 1,
      },
    };
    const result = await collection.updateOne(query, value);

  } catch (err) {
    console.log(err);
  } finally {
    // console.log('do')
    await client.close();
  }
}
module.exports = router