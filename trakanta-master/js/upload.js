var express = require('express')
var router = express.Router()
var multer = require('multer')
const querystring = require('querystring');
const fs = require('fs')
const { MongoClient } = require("mongodb")
var ObjectId = require('mongodb').ObjectId
var moment = require('moment')
const axios = require('axios');
//*Upload
var imagename;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
      var a;
      console.log(file)
        var str = file.mimetype;
        if(str == 'image/jpeg'){
           a = ".jpg"
        }else if(str == "image/png"){
          a = ".png"
        }
        // var type = str.substring(str.length - 4, str.length);
        imagename = file.originalname+ a;
        cb(null, imagename)
    }
})
const upload = multer({ storage: storage })

  router.post('/', upload.single('file'), async (req, res) => {
    // let session = req.session
    req.session.imgname = imagename;
    console.log("https://member.kruazappstreet.com/showpic/"+imagename)
    await axios({
      method: "post",
      url: "https://member.kruazappstreet.com/notic/img",
      data: querystring.stringify({imagename}),
    }).then(
      (response) => {
        if (response.status === 200) {
          console.log(response);
        }
      },
      (error) => {
        console.log("error นะคะ : "+error);
      }
    );
    // res.json({ file: req.file });
  });
  router.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
      res.status(422).json({ error: 'Only images are allowed' });
      return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(422).json({ error: 'Allow file size is 500KB' });
      return;
    }
  });


module.exports = router 