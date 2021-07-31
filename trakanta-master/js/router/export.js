var express = require('express')
var router = express.Router()
const axios = require('axios')
var moment = require('moment')
var ObjectId = require("mongodb").ObjectId;
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

var Log_process = require("../../model/logprocess_model");
var Order = require("../../model/order_model");
var GroupOrder = require("../../model/group_order_model");
const {
  ObjectID
} = require('mongodb');

require('dotenv').config()
var order;
var order_data = [];


router.post('/csv', (req, res) => {

  var all_id = req.body.vechicle;
console.log(req.body)
  if (req.body.vechicle == null) {
    res.redirect('/app/list?alert=warn-none-data')
  }
  getOrderid();

  async function getOrderid() {
    try {
      for (let i = 0; i < all_id.length; i++) {
        // console.log(all_id[1])
        await GetGrouporder(all_id[i])
      }
    } finally {

      const date = moment().format('report_DMMYYYY')
      // console.log('==============')
      var filename = './' + date + '.csv';
      // console.log(order_data)
      order_data = JSON.parse(JSON.stringify(order_data));

      const csv = new ObjectsToCsv(order_data)

      await csv.toDisk(filename)
      // unlink(filename);
      return res.download(filename, function (err) {
        if (err) {
          console.log(err); // Check error if you want
        }
        fs.unlink(filename, function () {
          order_data = []
          all_id = []
          names = []
          console.log("File was deleted") // Callback
        });
        // res.redirect('/app/list?alert=export-success-data')
        // fs.unlinkSync(yourFilePath) // If you don't need callback
      });
      // return res.download(filename)

    }
  }
  async function GetGrouporder(id) {
    try {

      const result = await Order.find({
        _id: ObjectId(id)
      });
      orderdata = result;
      //   console.log(result)
      //console.log(result)
    } finally {
      // console.log(
      //   orderdata[0].orderid
      // )
      order_data.push({
        orderid: orderdata[0].orderid,
        member_name: orderdata[0].member_name,
        facebook_name: orderdata[0].facebook_name,
        product_detail: orderdata[0].product_detail,
        product_size: orderdata[0].product_size,
        product_name: orderdata[0].product_name,
        product_price: orderdata[0].product_price,
        product_code: orderdata[0].product_code,
        product_category: orderdata[0].product_category,
        status: orderdata[0].status
      });
      // console.log(group_order)
      //   res.render('admin/dashboard', {
      //     axios: axios,
      //     data:  group_order,
      //     order: order
      //   })
    }
  }


})

module.exports = router