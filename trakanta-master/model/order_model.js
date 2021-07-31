// foodmodel.js

var mongoose = require("mongoose");

var orderSchema = mongoose.Schema(
  {
    // กำหนด ชื่อและชนิดของ document เรา
    orderid: {
      type: String
    },
    member_name: {
      type: String
    },
    product_detail: {
      type: String
    },
    product_size: {
      type: String
    },
    product_name: {
      type: String
    },
    facebook_name: {
      type: String
    },
    product_price: {
      type: Number
    },
    product_code: {
      type: String
    },
    product_category: {
      type: String
    },
    total_price: {
      type: Number
    },
    status: {
      type: String
    },
    date: { type: Date, default: Date.now },
    modify_date: { type: Date, default: Date.now },
  },
  {
    // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
    collection: "order"
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "foods"
var Order = mongoose.model("order", orderSchema);
module.exports = Order;
