const axios = require("axios");
var moment = require("moment");

var Order = require("../../model/order_model");
var GroupOrder = require("../../model/group_order_model");
const getOrderTotalPrice = async (start, end) => {
  try {
    let date_start;
    let date_end;
    if (start) {
      date_start = new Date(start + "T00:00:00.000Z");
      date_end = new Date(end + "T23:59:59.000Z");
      group_order = await Order.find({
        date: { $gte: date_start, $lt: date_end },
      });
      totalprice = await Order.aggregate([
        { $match: { date: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: "$product_price" } } },
      ]);
    } else {
      date_now = moment().format("YYYY-MM-DD");
      date_start = new Date(date_now + "T00:00:00.000Z");
      date_end = new Date(date_now + "T23:59:59.000Z");
      group_order = await Order.find({
        date: { $gte: date_start, $lt: date_end },
      });
      totalprice = await Order.aggregate([
        {
          $match: { date: { $gte: date_start, $lt: date_end } },
        },
        {
          $group: { _id: null, total: { $sum: "$product_price" } },
        },
      ]);
    }
  } finally {
    return totalprice;
  }
};
const delDATA = async (req, res) => {
  try {
    //format date req YYYY-MM-DD
    let {date} = req.body;
    let date_start;
    let date_end;
    let group_order;
    let order;
    if (date){
      date_now = moment().format("YYYY-MM-DD");
      date_start = new Date(date_now + "T00:00:00.000Z");
      date_end = new Date(date_now + "T23:59:59.000Z");
      group_order = await GroupOrder.deleteMany({
        date: { $gte: date_start, $lt: date_end },
      });
      order = await Order.deleteMany({
        date: { $gte: date_start, $lt: date_end },
      });
    }
    if(group_order) {
      res.json({
        status: 200,
        message: `ลบข้อมูลเรียบร้อย วันที่ ${date_start} ${date_end}เรียบร้อย`,
        order: order,
        group_order: group_order,
      });
    }else{
        res.json({
          status: 401,
          message: "ลบข้อมูลไม่สำเร็จ",
        });
      
    }
  } finally {
  }
};

module.exports = {
  delDATA,
  getOrderTotalPrice,
};
