// foodmodel.js

var mongoose = require("mongoose");

var logprocessSchema = mongoose.Schema(
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
    collection: "Logprocess"
  }
);

// ถ้าไม่ได้กำหนด collection ข้างบน default จะเป็น "foods"
var Logprocess = mongoose.model("Logprocess", logprocessSchema);
module.exports = Logprocess;