const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");
require("dotenv").config();
const uri = process.env.url;
const axios = require("axios");
var ObjectId = require("mongodb").ObjectId;
const querystring = require("querystring");
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
var moment = require("moment");
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
var mongoose = require("mongoose");
var mongo_uri = uri;
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(
    () => {
      console.log("[success] mongo : connected to the database ");
    },
    (error) => {
      console.log("[failed] mongo " + error);
      process.exit();
    }
  );

const { WebhookClient } = require("dialogflow-fulfillment");
// used
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    cookieName: "session",
    secret: "dgjdjdfjfjhhytjhd",
    duration: 30 * 60 * 1000,
    sctiveDuration: 50 * 60 * 1000,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

const cors = require("cors");

app.use(cors());

const port = process.env.PORT || 3000;

const showpic = require("./js/show");
const upload_page = require("./js/upload");
const otp = require("./js/otp");
const test = require("./js/test/test");
const manage_user = require("./js/admin/user");
const manage_member = require("./js/router/member");
const checklogin = require("./js/router/user");
const order = require("./js/router/order");
const history_login = require("./js/admin/history_list");
const history_process = require("./js/admin/history_process");
const export_csv = require("./js/router/export");
// const deleterev = require('./js/admin/delete')
const page = require("./js/page");
const { all } = require("./js/user/checklogin");
app.use("/app/", order);

app.use("/export/", export_csv);
app.use("/history-process/", history_process);
app.use("/history-login/", history_login);
app.use("/member/", manage_member);
app.use("/user/", manage_user);
app.use("/test/", test);
app.use("/checklogin/", checklogin);
app.get("/", (req, res) => {
  if (req.session.role === "") {
    // console.log("aa " + req.session.role)
    res.redirect("/home");
  } else {
    // console.log("aaa " + req.session.role)
    res.redirect("/login");
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
