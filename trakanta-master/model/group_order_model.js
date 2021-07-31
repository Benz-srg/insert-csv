// foodmodel.js

var mongoose = require("mongoose");

var grouporderSchema = mongoose.Schema(
  {
    // กำหนด ชื่อและชนิดของ document เรา
    orderid: {
      type: String,
    },
    member_name: {
      type: String,
    },
    product_detail: {
      type: String,
    },
    product_size: {
      type: String,
    },
    product_name: {
      type: String,
    },
    facebook_name: {
      type: String,
    },
    product_price: {
      type: Number,
    },
    product_code: {
      type: String,
    },
    product_category: {
      type: String,
    },
    totalprice: {
      type: Number,
    },
    status: {
      type: String,
    },
    date: { type: Date, default: Date.now },
    modify_date: { type: Date, default: Date.now },
  },
  {
    // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
    collection: "Grouporder",
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "foods"
var GroupOrder = mongoose.model("Grouporder", grouporderSchema);
module.exports = GroupOrder;
