var express = require("express");
var router = express.Router();
const axios = require("axios");
var moment = require("moment");
const uri = process.env.url;
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

var Log_process = require("../../model/logprocess_model");
var Member = require("../../model/member_model");
const Logprocess = require("../../model/logprocess_model");

router.get("/", (req, res) => {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  let member;
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
      member = await Member.find();
    } finally {
  
      // console.log(member)
      res.render("admin/member_list", {
        data: member,
        role: role,
        username: username,
        moment:moment,
      });
    }
  }
});

router.get("/view", (req, res) => {
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
  var order;
  Getorder();
  async function Getorder() {
    try {
      const result = await Member.find();
      order = result;
    } finally {
      // console.log(order);
      res.render("admin/member_list_view", {
        data: order,
        role: role,
        username: username,
      });
    }
  }
});

router.post("/editmember", (req, res) => {
  const id = req.body.id;
  const member_name = req.body.edit_member_name;
  const member_email = req.body.edit_member_email;
  const facebook_name_a = req.body.edit_facebook_name_a;
  const facebook_name_b = req.body.edit_facebook_name_b;
  const facebook_name_c = req.body.edit_facebook_name_c;
  const member_telno = req.body.edit_member_telno;
  const birthdate = req.body.edit_birthdate;
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
          facebook_name_a: facebook_name_a,
          facebook_name_b: facebook_name_b,
          facebook_name_c: facebook_name_c,
          member_email: member_email,
          member_telno: member_telno,
          birthdate: birthdate,
          member_address: member_address,
          sec_member_address: sec_member_address,
          // member_totalprice:member_totalprice,
          member_detail: member_detail,
          modify_date: new Date(),
        },
      };
      const result = await Member.updateOne(query, value);
    } finally {
      insertProcessStory();

      // insertHistory(id,amount,userid,detail)
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "แก้ไขสมาชิก",
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
      // console.log(loginsert);
    } finally {
      res.redirect("/member?alert=edit-success");
    }
  }
});
router.get("/del/:id", function (req, res) {
  var id = req.params.id;
  getUser();
  async function getUser() {
    try {
      const result = await Member.deleteOne({
        _id: ObjectId(id),
      });
    } catch (err) {
      // console.log(err);
    } finally {
      insertProcessStory();
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "ลบสมาชิก " + id,
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
      // console.log(loginsert);
    } finally {
      res.redirect("/member?alert=delete-success");
    }
  }
});
router.post("/insertmember", (req, res) => {
  // console.log(req.body);
  let result 
  var GetMember;
  var Check = 0;
  const member_name = req.body.member_name;
  const facebook_name_a = req.body.facebook_name_a;
  const facebook_name_b = req.body.facebook_name_b;
  const facebook_name_c = req.body.facebook_name_c;
  const member_email = req.body.member_email;
  const member_telno = req.body.member_telno;
  const birthdate = req.body.birthdate;
  const member_address = req.body.member_address;
  const sec_member_address = req.body.sec_member_address;
  const member_totalprice = req.body.totalprice;
  const member_detail = req.body.member_detail;

  // insertMember();
  checkMember();
  async function checkMember() {
    try {
      // create a document to be inserted
      const search = {
        member_name: member_name,
      };
      GetMember = await Member.find(search);
      // console.log(result)
    } finally {
      if (GetMember.length == 0) {
        insertMemberFacebookA();
      } else {
        if (GetMember[0].facebook_name_a == "") {
          insertMemberFacebookA();
        } else if (GetMember[0].facebook_name_b == "") {
          insertMemberFacebookB();
        } else if (GetMember[0].facebook_name_c == "") {
          insertMemberFacebookC();
        } else {
          insertMemberFacebookC();
        }
      }
      insertProcessStory();
    }
  }
  async function insertMemberFacebookA() {
    try {
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name_a: facebook_name_a,
        facebook_name_b: facebook_name_b,
        facebook_name_c: facebook_name_c,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        // member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      result = await Member.create(doc);
    } finally {
      insertProcessStory();
    }
  }
  async function insertMemberFacebookB() {
    
    try {
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name_b: facebook_name_a,
        facebook_name_c: facebook_name_b,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        // member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
     result = await Member.findOneAndUpdate({member_name: member_name},doc);
    } finally {
      res.json({ status: 200, data: result });
      // insertProcessStory();
    }
  }
  async function insertMemberFacebookC() {
    try {
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name_c: facebook_name_a,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        // member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      result = await Member.findOneAndUpdate({member_name: member_name},doc);
    } finally {
      insertProcessStory();
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "สร้างสมาชิก",
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
      // console.log(loginsert);
    } finally {
      res.redirect("/member?alert=insert-success");
    }
  }
});

router.post("/importmember", (req, res) => {
  var GetMember;
  // var group_order
  var checkmember;
  var row = req.body.row;
  console.log("============================");
  // console.log(req.body);
  var data = req.body.data.data;
  loopcheck();
  async function loopcheck() {
    try {
      if (row != 0) {
        // console.log("in");
        for (let i = 1; i < row; i++) {
          const member_name = data[i][0];
          const facebook_name = data[i][1];
          const member_email = data[i][2];
          const member_telno = data[i][3];
          const birthdate = data[i][4];
          const member_address = data[i][5];
          const sec_member_address = data[i][6];
          const member_totalprice = data[i][7];
          const member_detail = data[i][8];
          await check(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail
          );

          // console.log(member_name)
        }
        insertProcessStory();
      } else {
        for (let i = 1; i < data.length; i++) {
          const member_name = data[i][0];
          const facebook_name = data[i][1];
          const member_email = data[i][2];
          const member_telno = data[i][3];
          const birthdate = data[i][4];
          const member_address = data[i][5];
          const sec_member_address = data[i][6];
          const member_totalprice = data[i][7];
          const member_detail = data[i][8];
          await check(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail
          );

          // console.log(member_name)
        }
        insertProcessStory();
      }
    } finally {
      res.status(200).json({
        isConnected: true,
      });
    }
  }

  async function check(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    birthdate,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail
  ) {
    try {
      checkmember = ""
      // console.log(facebook_name)
      // console.log(facebook_name)
      let session = req.session;
      const name = session.name;
      checkmember = await Member.find({ member_name: member_name });
      // console.log(checkmember)
      //  console.log(loginsert)
      console.log(checkmember.length);
      
    } finally {
      if (checkmember.length == 1) {
        // var facebook = checkmember[0].facebook_name + ","+facebook_name.toString();
        if (checkmember[0].facebook_name_a == "") {
          console.log(checkmember[0].facebook_name_a);
          insertMemberFacebookA(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail,
            checkmember[0]._id
          );
        } else if (
          checkmember[0].facebook_name_b == "" &&
          checkmember[0].facebook_name_a != facebook_name
        ) {
          console.log(checkmember[0].facebook_name_b);
          insertMemberFacebookB(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail,
            checkmember[0]._id
          );
        } else if (
          checkmember[0].facebook_name_c == "" &&
          checkmember[0].facebook_name_a != facebook_name &&
          checkmember[0].facebook_name_b != facebook_name
        ) {
          console.log(checkmember[0].facebook_name_c);
          insertMemberFacebookC(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail,
            checkmember[0]._id
          );
        } else {
          console.log('else')
          facebook_name = checkmember[0].facebook_name_c;
          insertMemberFacebookC(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail,
            checkmember[0]._id
          );
        }
        // upDateMember();
      
      } else {
        if (facebook_name != "" && member_name != "") {
          insertMember(
            member_name,
            facebook_name,
            member_email,
            member_telno,
            birthdate,
            member_address,
            sec_member_address,
            member_totalprice,
            member_detail
          );
        }
      }
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "นำเข้าสมาชิก",
        date: new Date(),
      };
      await Logprocess.create(doc);
      //  console.log(loginsert)
    } finally {
    }
  }
  async function insertMemberFacebookA(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    birthdate,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail,
    id
  ) {
    try {
      console.log(facebook_name)
      // create a document to be inserted
      var query = { _id: ObjectId(id) };
      const doc = {
        member_name: member_name,
        facebook_name_a: facebook_name,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        // member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      const result = await Member.findOneAndUpdate(query, doc);
      // console.log(result);
    } finally {
    }
  }
  async function insertMemberFacebookB(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    birthdate,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail,
    id
  ) {
    try {
      console.log(facebook_name)
      // create a document to be inserted
      var query = { _id: ObjectId(id) };
      const doc = {
        member_name: member_name,
        facebook_name_b: facebook_name,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      const result = await Member.findOneAndUpdate(query, doc);
      // console.log(result);
    } finally {
      // console.log('test')
    }
  }
  async function insertMemberFacebookC(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    birthdate,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail,
    id
  ) {
    try {
      console.log(facebook_name)
      // create a document to be inserted

      var query = { _id: ObjectId(id) };
      const doc = {
        member_name: member_name,
        facebook_name_c: facebook_name,
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      const result = await Member.findOneAndUpdate(query, doc);
      // console.log(result);
    } finally {
    }
  }
  async function insertMember(
    member_name,
    facebook_name,
    member_email,
    member_telno,
    birthdate,
    member_address,
    sec_member_address,
    member_totalprice,
    member_detail
  ) {
    try {
      // create a document to be inserted
      const doc = {
        member_name: member_name,
        facebook_name_a: facebook_name,
        facebook_name_b: "",
        facebook_name_c: "",
        member_email: member_email,
        member_telno: member_telno,
        birthdate: birthdate,
        member_address: member_address,
        sec_member_address: sec_member_address,
        member_totalprice: member_totalprice,
        member_detail: member_detail,
        modify_date: new Date(),
        date: new Date(),
      };
      if (facebook_name) {
        const a = await Member.create(doc);
        // console.log("none");
      } else {
        // const a = await Member.create(doc);
        // console.log("not empty");
        // console.log(a)
      }
    } finally {
    }
  }
});
module.exports = router;
