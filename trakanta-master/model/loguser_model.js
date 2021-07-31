// foodmodel.js

var mongoose = require("mongoose");

var loguserSchema = mongoose.Schema(
  {
    // กำหนด ชื่อและชนิดของ document เรา
    userID: {
      type: String
    },
    action: {
      type: String
    },
    date: { type: Date, default: Date.now },
  },
  {
    // กำหนด collection ของ MongoDB หรือจะไม่กำหนดก็ได้
    collection: "Loguser"
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "foods"
var Log_user = mongoose.model("loguser", loguserSchema);
module.exports = Log_user;