var express = require("express");
var router = express.Router();
const axios = require("axios");
var moment = require("moment");
var ObjectId = require("mongodb").ObjectId;

var Log_process = require("../../model/logprocess_model");
var Order = require("../../model/order_model");
var GroupOrder = require("../../model/group_order_model");
const {
  getOrderTotalPrice } = require("../api/order");
require("dotenv").config();
var user;
var user_data = [];

router.get("/", (req, res) => {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  console.log("TEST : " + session.role);
  if (req.session.role == "Admin") {
    Getorder();
  } else if (req.session.role == "HR") {
    res.redirect("/app/view");
    Getorder();
  } else if (req.session.role == "Packing") {
    res.redirect("/app/view");
    Getorder();
  } else if (req.session.role == "Sale Admin") {
    Getorder();
  } else if (req.session.role == "Owner") {
    Getorder();
  } else if (req.session.role == "Data Analyst") {
    res.redirect("/app/view");
    Getorder();
  } else {
    res.redirect("/login");
  }
  var order_data;
  var group_order;
  //* start date - end date
  var start = req.query.date_start;
  var end = req.query.date_end;
  var date_start = new Date(
    moment(start + ",0:00:00", "YYYY-MM-DD,h:mm:ss").format()
  );
  var date_end = new Date(
    moment(end + ",23:59:59", "YYYY-MM-DD,hh:mm:ss").format()
  );
  async function Getorder() {
    try {
      const result = await Order.find();
      order = result;
      // console.log(order)
    } finally {
      GetGrouporder();
    }
  }
  async function GetGrouporder() {
    try {
      //? เช็ค datepicker
      if (req.query.date_start) {
        group_order = await GroupOrder.find({
          date: {
            $gte: date_start,
            $lt: date_end,
          },
        });
      } else {
        group_order = await GroupOrder.find();
      }
      // console.log("date start : " + date_start);
      // console.log("date end : " + date_end);
      //console.log(group_order);
      // const result = await GroupOrder.find();
      // group_order = result;
    } finally {
      // console.log(group_order)
      res.render("admin/dashboard", {
        axios: axios,
        data: group_order,
        order: order,
        moment: moment,
        role: role,
        username: username,
        select_date: moment(req.query.date_start).format("D/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("D/MM/YYYY"),
      });
    }
  }
});


module.exports = router;