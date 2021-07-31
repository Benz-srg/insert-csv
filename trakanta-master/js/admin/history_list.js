var express = require("express");
var router = express.Router();
const axios = require("axios");
var moment = require("moment");
const uri = process.env.url;
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
var user;
var user_data = [];
var Log_user = require("../../model/loguser_model");
router.get("/", (req, res) => {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  var history;
  if (req.session.role == "Admin") {
    Gethistory();
  } else if (req.session.role == "HR") {
    Gethistory();
  } else if (req.session.role == "Packing") {
    Gethistory();
  } else if (req.session.role == "Sale Admin") {
    Gethistory();
  } else if (req.session.role == "Owner") {
    Gethistory();
  } else if (req.session.role == "Data Analyst") {
    Gethistory();
  } else {
    res.redirect("/login");
  }
  // var history
  // Gethistory();
  async function Gethistory() {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      const result = await Log_user.find();
      history = result;
    } finally {
      console.log(history);
      res.render("admin/history_list", {
        data: history,
        role: role,
        username: username,
        moment,
      });
    }
  }
});
router.post("/editmember", (req, res) => {
  const id = req.body.id;
  const member_name = req.body.edit_member_name;
  const member_email = req.body.edit_member_email;
  const facebook_name = req.body.edit_facebook_name;
  const member_telno = req.body.edit_member_telno;
  const member_address = req.body.edit_member_address;
  const sec_member_address = req.body.edit_sec_member_address;
  const member_totalprice = req.body.edit_member_totalprice;
  const member_detail = req.body.edit_member_detail;

  updateMember();
  async function updateMember() {
    try {
      // create a document to be inserted

      var query = { _id: ObjectId(id) };
      var value = {
        $set: {
          member_name: member_name,
          facebook_name: facebook_name,
          member_email: member_email,
          member_telno: member_telno,
          member_address: member_address,
          sec_member_address: sec_member_address,
          member_totalprice: member_totalprice,
          member_detail: member_detail,
        },
      };
      const result = await Log_user.updateOne(query, value);
    } finally {
      res.redirect("/member?alert=edit-success");
      // insertHistory(id,amount,userid,detail)
      await client.close();
    }
  }
});
router.get("/del/:id", function (req, res) {
  var id = req.params.id;
  getUser();
  async function getUser() {
    try {
      const result = await Log_user.deleteOne({
        _id: ObjectId(id),
      });
    } catch (err) {
      console.log(err);
    } finally {
      client.close();
      res.redirect("/member?alert=delete-success");
    }
  }
});
router.post("/insertmember", (req, res) => {
  const member_name = req.body.member_name;
  const facebook_name = req.body.facebook_name;
  const member_email = req.body.member_email;
  const member_telno = req.body.member_telno;
  const member_address = req.body.member_address;
  const sec_member_address = req.body.sec_member_address;
  const member_totalprice = req.body.totalprice;
  const member_detail = req.body.member_detail;
  // console.log(req.body)
  insertMember();
  async function insertMember() {
    try {
      const datetime = moment().format("D/MM/YYYY hh:mm:ss");
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name: facebook_name,
        member_email: member_email,
        member_telno: member_telno,
        member_address: member_address,
        sec_member_address: sec_member_address,
        member_totalprice: member_totalprice,
        member_detail: member_detail,
        date: datetime,
      };
      const result = await Log_user.insertOne(doc);
    } finally {
      res.redirect("/member?alert=insert-success");
    }
  }
});
router.post("/importmember", (req, res) => {
  // var order
  // var group_order
  var data = req.body.data.data;
  for (let i = 1; i < data.length; i++) {
    const member_name = data[i][0];
    const facebook_name = data[i][1];
    const member_email = data[i][2];
    const member_telno = data[i][3];
    const member_address = data[i][4];
    const sec_member_address = data[i][5];
    const member_totalprice = data[i][6];
    const member_detail = data[i][7];
    insertMember(
      member_name,
      facebook_name,
      member_email,
      member_telno,
      member_address,
      sec_member_address,
      member_totalprice,
      member_detail
    );
    // console.log(member_name)
  }
  async function insertMember(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail
  ) {
    try {
      const datetime = moment().format("D/MM/YYYY hh:mm:ss");
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name: facebook_name,
        member_email: member_email,
        member_telno: member_telno,
        member_address: member_address,
        sec_member_address: sec_member_address,
        member_totalprice: member_totalprice,
        member_detail: member_detail,
        date: datetime,
      };
      const result = await Log_user.insertOne(doc);
    } finally {
      res.status(200).json({
        isConnected: true,
      });
    }
  }
});
module.exports = router;
