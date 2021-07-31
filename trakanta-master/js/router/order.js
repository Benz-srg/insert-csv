var express = require("express");
var router = express.Router();
const axios = require("axios");
var moment = require("moment");
var ObjectId = require("mongodb").ObjectId;

var Log_process = require("../../model/logprocess_model");
var Order = require("../../model/order_model");
var GroupOrder = require("../../model/group_order_model");
const { getOrderTotalPrice, delDATA } = require("../api/order");
const { BSONType } = require("mongodb");
require("dotenv").config();
var user;
var user_data = [];

router.get("/", (req, res) => {
  // Getorder();
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
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
  var start;
  var end;
  async function Getorder() {
    // console.log(req.query.date_start)
    try {
    } finally {
      GetGrouporder();
    }
  }
  async function GetGrouporder() {
    let { date_start, date_end } = req.query;
    let date_now = moment().format("YYYY-MM-DD");
    try {
      //? เช็ค datepicker
      if (date_start) {
        start = new Date(
          moment(date_start + ",0:00:00", "YYYY-MM-DD,h:mm:ss").format()
        );
        end = new Date(
          moment(date_end + ",23:59:59", "YYYY-MM-DD,hh:mm:ss").format()
        );
        group_order = await GroupOrder.find({
          date: {
            $gte: start,
            $lt: end,
          },
        });
      } else {
        start = new Date(
          moment(date_now + ",0:00:00", "YYYY-MM-DD,h:mm:ss").format()
        );
        end = new Date(
          moment(date_now + ",23:59:59", "YYYY-MM-DD,hh:mm:ss").format()
        );
        group_order = await GroupOrder.find({
          date: {
            $gte: start,
            $lt: end,
          },
        });
      }
    } finally {
      res.render("admin/dashboard", {
        axios: axios,
        data: group_order,
        //order: order,
        moment: moment,
        role: role,
        username: username,
        select_date:
          moment(req.query.date_start).format("D/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("D/MM/YYYY"),
      });
    }
  }
});
router.post("/dataData", delDATA);
router.get("/view", (req, res) => {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;

  if (req.session.role) {
    Getorder();
  } else {
    res.redirect("/login");
  }
  var order_data;
  var group_order;

  async function Getorder() {
    try {
      const result = await Order.find();
      order = result;
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
            $gte: moment(req.query.date_start).format("D/MM/YYYY"),
            $lt: moment(req.query.date_end).format("D/MM/YYYY"),
          },
        });
      } else {
        group_order = await GroupOrder.find();
      }
    } finally {
      res.render("admin/dashboard_view", {
        axios: axios,
        data: group_order,
        order: order,
        moment: moment,
        role: role,
        username: username,
        select_date:
          moment(req.query.date_start).format("D/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("D/MM/YYYY"),
      });
    }
  }
});

router.post("/status", (req, res) => {
  var result;
  var edit_status;
  const orderid = req.body.orderid;

  if (req.body.edit_status != "") {
    edit_status = req.body.edit_status;
  } else {
    edit_status = req.body.old_status;
  }
  UpdateStatus();
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  async function UpdateStatus() {
    try {
      var query = {
        orderid: orderid,
      };
      var value = {
        $set: {
          status: edit_status,
          modify_date: new Date(),
        },
      };
      result = await Order.updateMany(query, value);
    } finally {
      UpdateGrouporder();
    }
  }
  async function UpdateGrouporder() {
    try {
      var query = {
        orderid: orderid,
      };
      var value = {
        $set: {
          status: edit_status,
        },
      };
      insertProcessStory();
      result = await GroupOrder.updateMany(query, value);
    } finally {
      res.redirect("/app?alert=edit-status");
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const role = session.role;
      const doc = {
        userID: name,
        action: "เปลี่ยนแปลงสถานะ",
        date: new Date(),
        role: role,
        username: username,
      };
      const loginsert = await Log_process.create(doc);
    } finally {
    }
  }
});
router.post("/del", (req, res) => {
  var id = req.body.id;
  var price = parseInt(req.body.price);
  var orderid = req.body.orderid;
  var order;
  deleteOrder();
  async function deleteOrder() {
    try {
      const result = await Order.deleteOne({
        _id: ObjectId(id),
      });
      group_order = result;
    } finally {
      getOldPrice();
      logDeleteOrder();
    }
  }
  async function logDeleteOrder() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "ลบออเดอร์ " + orderid,
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
    } finally {
    }
  }
  async function getOldPrice() {
    try {
      var query = {
        orderid: orderid,
      };
      order = await GroupOrder.find(query);
    } finally {
      const finalprice = parseInt(order[0].totalprice) - parseInt(price);
      UpdatepriceOrder(finalprice);
    }
  }
  async function UpdatepriceOrder(finalprice) {
    try {
      var query = {
        orderid: orderid,
      };
      var value = {
        $set: {
          totalprice: finalprice,
        },
      };
      const order = await GroupOrder.findOneAndUpdate(query, value);
    } finally {
      res.redirect("/app?alert=delete-list-success");
    }
  }
});
router.get("/delData/", (req, res) => {
  const role = req.session.role;
  const username = req.session.username;
  // if (req.session.role) {
  //   Getorder();
  // } else {
  //   res.redirect("/login");
  // }
  Getorder();
  async function Getorder() {
    try {
      const result = await Order.find();
      order = result;
    } finally {
      res.render('admin/delWrongImport',{role: role,username:username})
    }
  }
});
router.get("/list", (req, res) => {
  let session = req.session;
  let start;
  let end;
  let totalprice;
  var date_now;
  var group_order;
  const name = session.name;
  const role = session.role;
  const username = session.username;
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

  async function Getorder() {
    let {
      member_name,
      product_name,
      category_name,
      status,
      date_start,
      date_end,
    } = req.query;

    let payload = {};
    let dataSearch = {};
    try {
      if (date_start) {
        start = new Date(
          moment(date_start + ",00:00:00", "YYYY-MM-DD,hh:mm:ss").format()
        );
        end = new Date(
          moment(date_end + ",23:59:59", "YYYY-MM-DD,hh:mm:ss").format()
        );

        // date_start = new Date(date_start + "T00:00:00.000Z");
        // date_end = new Date(date_end + "T23:59:59.000Z");

        if (member_name != "") {
          dataSearch.facebook_name = member_name;
          payload.facebook_name = {
            $regex: ".*" + member_name.replace("\t", "") + ".*",
          };
        }
        if (category_name != "") {
          dataSearch.category_name = category_name;
          payload.product_category = category_name;
        }
        if (product_name != "") {
          dataSearch.product_name = product_name;
          payload.product_name = {
            $regex: ".*" + product_name.replace("\t", "") + ".*",
          };
        }
        if (status != "") {
          dataSearch.status = status;
          payload.status = status;
        }
        // group_order = await Order.find({ date: { $gte: date_start,$lt: date_end}});
        group_order = await Order.find({
          $and: [{ date: { $gte: start, $lte: end } }, payload],
        });

        totalprice = await Order.aggregate([
          { $match: { $and: [{ date: { $gte: start, $lte: end } }, payload] } },
          // { $match: { date: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: "$product_price" } } },
        ]);
        // console.log(totalprice);
        // console.log(totalprice);
      } else {
        date_now = moment().format("YYYY-MM-DD");
        date_start = new Date(date_now + "T00:00:00.000Z");
        date_end = new Date(date_now + "T23:59:59.000Z");
        group_order = await Order.find({
          date: { $gte: date_start, $lte: date_end },
        });

        totalprice = await Order.aggregate([
          { $match: { date: { $gte: date_start, $lte: date_end } } },
          { $group: { _id: null, total: { $sum: "$product_price" } } },
        ]);
      }
    } finally {
      if (totalprice.length > 0) {
        totalprice = totalprice[0].total;
        totalprice = totalprice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        totalprice = 0;
      }

      res.render("admin/orderlist", {
        axios: axios,
        data: group_order,
        order: group_order,
        username: username,
        role: role,
        totalprice: totalprice,
        date_start: moment(date_start).format("YYYY-MM-DD"),
        date_end: moment(date_end).format("YYYY-MM-DD"),
        moment: moment,
        payload: dataSearch,
        select_date:
          moment(req.query.date_start).format("DD/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("DD/MM/YYYY"),
      });
    }
  }
});
router.post("/delall", async (req, res) => {
  var group_order;
  date_start = new Date("2021-07-08T00:00:00.000Z");
  date_end = new Date("2021-07-08T23:59:59.000Z");
  try {
    group_order = await GroupOrder.find({
      date: {
        $gte: date_start,
        $lt: date_end,
      },
    });
  } finally {
    res.json({ status: 200, group_order: group_order });
  }
});
router.get("/list-sum", (req, res) => {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;

  Getorder();

  var order_data;
  var group_order;

  async function Getorder() {
    try {
      //? เช็ค datepicker
      if (req.query.date_start) {
        group_order = await Order.aggregate([
          {
            $group: {
              _id: "$facebook_name",
              product_price: {
                $sum: {
                  $multiply: "$product_price",
                },
              },
              orderid: {
                $first: "$orderid",
              },
              member_name: {
                $first: "$member_name",
              },
              facebook_name: {
                $first: "$facebook_name",
              },
              product_detail: {
                $first: "$product_detail",
              },
              product_size: {
                $first: "$product_size",
              },
              product_name: {
                $first: "$product_name",
              },
              product_code: {
                $first: "$product_code",
              },
              product_category: {
                $first: "$product_category",
              },
              status: {
                $first: "$status",
              },
              date: {
                $first: "$date",
              },
              modify_date: {
                $first: "$modify_date",
              },
              count: {
                $sum: 1,
              },
            },
          },
        ]);
      } else {
        group_order = await Order.aggregate([
          {
            $group: {
              _id: "$facebook_name",
              product_price: {
                $sum: {
                  $multiply: "$product_price",
                },
              },
              orderid: {
                $first: "$orderid",
              },
              member_name: {
                $first: "$member_name",
              },
              facebook_name: {
                $first: "$facebook_name",
              },
              product_detail: {
                $first: "$product_detail",
              },
              product_size: {
                $first: "$product_size",
              },
              product_name: {
                $first: "$product_name",
              },
              product_code: {
                $first: "$product_code",
              },
              product_category: {
                $first: "$product_category",
              },
              status: {
                $first: "$status",
              },
              date: {
                $first: "$date",
              },
              modify_date: {
                $first: "$modify_date",
              },
              count: {
                $sum: 1,
              },
            },
          },
        ]);
      }
    } finally {
      res.render("admin/orderlist_sum", {
        axios: axios,
        data: group_order,
        order: group_order,
        username: username,
        role: role,
        moment: moment,
        select_date:
          moment(req.query.date_start).format("D/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("D/MM/YYYY"),
      });
    }
  }
});

router.get("/list/view", async function (req, res) {
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
  var order_data;
  var group_order;
  // Getorder();
  async function Getorder() {
    try {
      //? เช็ค datepicker
      if (req.query.date_start) {
        group_order = await Order.find({
          date: {
            $gte: moment(req.query.date_start).format("D/MM/YYYY"),
            $lt: moment(req.query.date_end).format("D/MM/YYYY"),
          },
        });
      } else {
        group_order = await Order.find();
      }
    } finally {
      res.render("admin/orderlist_view", {
        axios: axios,
        data: group_order,
        order: group_order,
        username: username,
        role: role,
        moment: moment,
        select_date:
          moment(req.query.date_start).format("D/MM/YYYY") +
          " - " +
          moment(req.query.date_end).format("D/MM/YYYY"),
      });
    }
  }
});

router.get("/order/:id", (req, res) => {
  const id = req.params.id;
  var result;
  getOrderbyid();
  async function getOrderbyid() {
    try {
      result = await Order.find({
        orderid: id,
      });
    } finally {
      res.json(result);
    }
  }
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("home");
});

router.post("/createorder", function (req, res) {
  var od_id = 0;

  var order = [];
  const member_name = req.body.membername;
  const product_size = req.body.productsize;
  const product_name = req.body.productname;
  const product_detail = req.body.productdetail;
  const product_code = req.body.productcode;
  const product_category = req.body.category;
  const product_price = req.body.productprice;
  const total_price = req.body.totalprice;
  const status = req.body.status;
  const facebook_name = req.body.facebook_name;
  const date = moment().format("D/MM/YYYY 11:59 PM");
  getLastorder();
  async function getLastorder() {
    try {
      const result = await Order.find();
      for (let i = 0; i < result.length; i++) {
        const id = parseInt(result[i].orderid);
        if (od_id < id) {
          od_id = id;
        }
      }
      order = result;
    } finally {
      insertGroupOrder();
      insertProcessStory();
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "สร้างออเดอร์",
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
    } finally {
    }
  }

  async function insertGroupOrder() {
    try {
      var orderid = od_id + 1;
      // create a document to be inserted
      const doc = {
        orderid: orderid,
        member_name: member_name,
        facebook_name: facebook_name,
        product_detail: product_detail,
        product_size: product_size,
        product_name: product_name,
        product_price: Number(product_price),
        product_code: product_code,
        product_category: product_category,
        totalprice: Number(total_price),
        status: status,
        date: new Date(),
        modify_date: new Date(),
      };
      const result = await GroupOrder.create(doc);
    } finally {
      insertOrder(orderid);
    }
  }
  async function insertOrder(orderid) {
    try {
      // create a document to be inserted
      const doc = {
        orderid: orderid,
        member_name: member_name,
        facebook_name: facebook_name,
        product_detail: product_detail,
        product_size: product_size,
        product_name: product_name,
        product_price: Number(product_price),
        product_code: product_code,
        product_category: product_category,
        status: status,
        date: new Date(),
        modify_date: new Date(),
      };
      const result = await Order.create(doc);
    } finally {
      res.redirect("/app?alert=create-success");
    }
  }
});

router.post("/importorder", function (req, res) {
  let session = req.session;
  const name = session.name;
  const role = session.role;
  const username = session.username;
  var Logtotalprice = 0;
  var orderdata = [];
  var order_group = [];
  var od_id = 0;
  var allorder = req.body.data.data;
  var row = req.body.row;
  var length = allorder.length;
  getLastorder();
  async function getLastorder() {
    try {
      const result = await Order.find();
      for (let i = 0; i < result.length; i++) {
        const id = parseInt(result[i].orderid);
        if (od_id < id) {
          od_id = id;
        }
      }
      order = result;
    } finally {
      check(od_id);
      insertProcessStory();
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "นำเข้าออเดอร์",
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
    } finally {
    }
  }
  async function check(od_id) {
    try {
      var check = 1;

      if (row != 0) {
        for (let i = 1; i < row; i++) {
          if (allorder[i][6] != "" && check != 0) {
            check = 1;
            od_id += 1;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
            order_group.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              totalprice: allorder[i][6],
              orderid: od_id,
            });
          } else if (allorder[i][6] == "" && check != 0) {
            check = 0;
            od_id += 1;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
          } else if (allorder[i][6] != "" && check == 0) {
            check = 1;
            od_id += 0;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
            order_group.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              totalprice: allorder[i][6],
              orderid: od_id,
            });
          } else if (allorder[i][6] == "" && check == 0) {
            check = 0;
            od_id += 0;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
          }
        }
      } else {
        for (let i = 1; i < length; i++) {
          if (allorder[i][6] != "" && check != 0) {
            check = 1;
            od_id += 1;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
            order_group.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              totalprice: allorder[i][6],
              orderid: od_id,
            });
          } else if (allorder[i][6] == "" && check != 0) {
            check = 0;
            od_id += 1;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
          } else if (allorder[i][6] != "" && check == 0) {
            check = 1;
            od_id += 0;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
            order_group.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              totalprice: allorder[i][6],
              orderid: od_id,
            });
          } else if (allorder[i][6] == "" && check == 0) {
            check = 0;
            od_id += 0;
            orderdata.push({
              member_name: allorder[i][0],
              facebook_name: allorder[i][1],
              product_size: allorder[i][2],
              product_name: allorder[i][3],
              product_code: allorder[i][4],
              product_price: allorder[i][5],
              orderid: od_id,
            });
          }
        }
      }
    } finally {
      Loopinsertorder();
      Loopinsertordergroup();
    }
  }
  async function Loopinsertordergroup() {
    try {
      for (let n = 0; n < order_group.length; n++) {
        const product_name = order_group[n].product_name;
        var ca = product_name.indexOf("ผ้าไหม");
        var cb = product_name.indexOf("เสื้อไหม");
        var cc = product_name.indexOf("เสื้อ");
        var cd = product_name.indexOf("เงิน");
        var ce = product_name.indexOf("กางเกง");
        var cf = product_name.indexOf("กางเกงไหม");
        var cg = product_name.indexOf("คลุมไหล่");
        const member_name = order_group[n].member_name;
        const facebook_name = order_group[n].facebook_name;
        const product_size = order_group[n].product_size;
        const product_code = order_group[n].product_code;
        const product_price = order_group[n].product_price;
        const totalprice = order_group[n].totalprice;
        const orderid = order_group[n].orderid;

        if (ca != -1) {
          const product_category = "ผ้าไหม";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cb != -1) {
          const product_category = "เสื้อไหม";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cc != -1) {
          const product_category = "เสื้อฝ้าย";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cd != -1) {
          const product_category = "เครื่องเงิน";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cf != -1) {
          const product_category = "กางเกงผ้าไหม";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (ce != -1) {
          const product_category = "กางเกงผ้าฝ้าย";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cg != -1) {
          const product_category = "ผ้าคลุมไหล่";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else {
          const product_category = "ผ้าฝ้าย";
          insertOrderGroup(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        }
      }
    } finally {
    }
  }
  async function insertOrderGroup(
    orderid,
    product_name,
    product_price,
    product_code,
    product_category,
    member_name,
    facebook_name,
    product_size,
    totalprice
  ) {
    try {
      // create a document to be inserted
      const doc = {
        orderid: orderid,
        member_name: member_name,
        facebook_name: facebook_name,
        product_detail: "",
        product_size: product_size,
        product_name: product_name,
        product_price: Number(product_price),
        product_code: product_code,
        product_category: product_category,
        totalprice: Number(totalprice),
        status: 3,
        date: new Date(),
        modify_date: new Date(),
      };
      const result = await GroupOrder.create(doc);
    } finally {
    }
  }
  //Loopinsertorder();
  async function Loopinsertorder() {
    try {
      for (let n = 0; n < orderdata.length; n++) {
        const product_name = orderdata[n].product_name;
        var ca = product_name.indexOf("ผ้าไหม");
        var cb = product_name.indexOf("เสื้อไหม");
        var cc = product_name.indexOf("เสื้อ");
        var cd = product_name.indexOf("เงิน");
        var ce = product_name.indexOf("กางเกง");
        var cf = product_name.indexOf("กางเกงไหม");
        var cg = product_name.indexOf("คลุมไหล่");
        const member_name = orderdata[n].member_name;
        const facebook_name = orderdata[n].facebook_name;
        const product_size = orderdata[n].product_size;
        const product_code = orderdata[n].product_code;
        const product_price = orderdata[n].product_price;
        const totalprice = orderdata[n].totalprice;
        const orderid = orderdata[n].orderid;
        if (ca != -1) {
          const product_category = "ผ้าไหม";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cb != -1) {
          const product_category = "เสื้อไหม";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cc != -1) {
          const product_category = "เสื้อฝ้าย";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cd != -1) {
          const product_category = "เครื่องเงิน";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cf != -1) {
          const product_category = "กางเกงผ้าไหม";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (ce != -1) {
          const product_category = "กางเกงผ้าฝ้าย";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else if (cg != -1) {
          const product_category = "ผ้าคลุมไหล่";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        } else {
          const product_category = "ผ้าฝ้าย";
          insertOrder(
            orderid,
            product_name,
            product_price,
            product_code,
            product_category,
            member_name,
            facebook_name,
            product_size,
            totalprice
          );
        }
      }
    } finally {
    }
  }

  async function insertOrder(
    orderid,
    product_name,
    product_price,
    product_code,
    product_category,
    member_name,
    facebook_name,
    product_size,
    totalprice
  ) {
    try {
      // create a document to be inserted
      const doc = {
        orderid: orderid,
        member_name: member_name,
        facebook_name: facebook_name,
        product_detail: "",
        product_size: product_size,
        product_name: product_name,
        product_price: Number(product_price),
        product_code: product_code,
        product_category: product_category,
        totalprice: Number(totalprice),
        status: 3,
        date: new Date(),
        modify_date: new Date(),
      };
      const result = await Order.create(doc);
    } finally {
    }
  }
  orderdata = [];
  order_group = [];
  setTimeout(function () {
    res.status(200).json({
      isConnected: true,
    });
  }, 6000);
});

router.post("/editorder", function (req, res) {
  var id = req.body._id;
  var od_id = 0;
  var result;
  const member_name = req.body.edit_member_name;
  const facebook_name = req.body.edit_facebook_name;
  const product_size = req.body.edit_product_size;
  const product_name = req.body.edit_product_name;
  const product_detail = req.body.edit_product_detail;
  const product_code = req.body.edit_product_code;
  const category = req.body.edit_category;
  const product_price = req.body.edit_product_price;
  const totalprice = req.body.totalprice;
  const status = req.body.edit_status;
  const old_price = req.body.old_price;
  var last_price = req.body.last_price;
  var finalprice = product_price - old_price;
  const date = moment().format("D/MM/YYYY 11:59 PM");
  updateOrder();

  async function updateOrder() {
    try {
      var query = {
        _id: ObjectId(id),
      };
      var value = {
        $set: {
          member_name: member_name,
          facebook_name: facebook_name,
          product_size: product_size,
          product_name: product_name,
          product_price: Number(product_price),
          product_detail: product_detail,
          product_code: product_code,
          product_category: category,
          status: status,
          totalprice: totalprice,
          modify_date: new Date(),
        },
      };
      await Order.findOneAndUpdate(query, value);
    } finally {
      insertProcessStory();
      findOrder();
      // insertHistory(id,amount,userid,detail)
    }
  }
  async function insertProcessStory() {
    try {
      let session = req.session;
      const name = session.name;
      const doc = {
        userID: name,
        action: "แก้ไขรายการออเดอร์",
        date: new Date(),
      };
      const loginsert = await Log_process.create(doc);
    } finally {
    }
  }
  async function findOrder() {
    try {
      var query = {
        _id: ObjectId(id),
      };
      result = await Order.find(query);
    } finally {
      UpdateGrouporder(result[0].orderid, finalprice);
      // res.redirect("/app?alert=edit-success");
      // insertHistory(id,amount,userid,detail)
    }
  }
  async function UpdateGrouporder(oid, finalprice) {
    var price = parseInt(last_price) + parseInt(finalprice);
    try {
      var query = {
        orderid: oid,
      };
      var value = {
        $set: {
          totalprice: Number(price),
        },
      };
      await GroupOrder.findOneAndUpdate(query, value);
    } finally {
      res.redirect("/app?alert=edit-success");
      // insertHistory(id,amount,userid,detail)
    }
  }
});

module.exports = router;
