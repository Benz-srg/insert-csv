// foodmodel.js

var mongoose = require("mongoose");

var userSchema = mongoose.Schema(
  {
    // กำหนด ชื่อและชนิดของ document เรา
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    telno: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    totalprice: {
      type: Number,
    },
    date: { type: Date, default: Date.now },
    userid: {
      type: String,
    },
  },
  {
    // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
    collection: "user",
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "foods"
var User = mongoose.model("user", userSchema);
module.exports = User;
