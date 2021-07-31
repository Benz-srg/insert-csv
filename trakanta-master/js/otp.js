var express = require('express')
var router = express.Router()
const axios = require('axios')
const uri = process.env.url;
var randomstring = require("randomstring");
const {
    MongoClient
} = require("mongodb")
var ObjectId = require('mongodb').ObjectId
var random_number = randomstring.generate({
    length: 6,
    charset: '0123456789'
});
var OTPchar = randomstring.generate({
    length: 6,
    charset: '0123456789ABCDEFGHIGKLMNOQRSTUVWXYZ!@#$%^&*()_'
});
var ver;
router.get('/', function (req, res) {
    
    res.render('anonymous/page_otp');
})

router.post('/request', function (req, res) {
    //*check phone number
    async function check() {
        const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db("KruaZapp");
            const collection = database.collection("user");
            const query = {
                phone: req.body.phone
            }
            const result = await collection.findOne(query);

            if (result) res.redirect('/page?alert=already-phone')
            else {
                let session = req.session
                session.phone = req.body.phone
                session.otp = random_number
                session.ver = OTPchar
                ver = OTPchar;
                axios.get('http://www.thsms.com/api/rest', {
                        params: {
                            method: 'send',
                            username: 'tectony',
                            password: '&1Va64vBHq5F99AJ',
                            from: 'VIP',
                            to: req.body.phone,
                            message: 'Your verification code is : '+ OTPchar +' \nOTP : '+ random_number ,
                        }
                    })
                    .then(function (response) {
                        console.log(response.data);
                        insert(req.body.phone, random_number)
                        res.redirect('/otp/verify')
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.redirect('/page?alert=error-phone')
                    })
            }
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
    }
    check()
})

async function insert(phone, number) {
    const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
    try {
        await client.connect();
        const database = client.db("KruaZapp");
        const collection = database.collection('otp')
        value = {
            pin: number,
            phone: phone,
            date: new Date()
        }
        insertOne = await collection.insertOne(value)
    } catch (err) {
        console.log(err)
    } finally {
        client.close()
    }
}

router.get('/verify', function (req, res) {

    var id;
    var strid;
    async function checklogin() {
        console.log(req.body)
        const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});

        try {
          await client.connect();
          const database = client.db("KruaZapp");
          const collection = database.collection("user");
          const Loguser = await collection.findOne({
            userID: req.session.userid
          })
            ver = req.session.ver;
            id = Loguser._id; 

        } finally {
            // id = req.session.objid;
            console.log("-------------------------------------") 
            console.log(" id : "+id) 
            console.log("-------------------------------------") 
            await client.close();
            res.render('user/page_otp',{data:id,ver:ver});
        }
      }
      checklogin();
     
})


router.post('/verify', function (req, res) {
    console.log(req.body);
    var obj = req.body.id;
    
    if (req.session.otp == req.body.otp) {
        
        
        req.session.otp = ''

        async function insertUser() {
            const client = new MongoClient(uri,{useNewUrlParser: true,useUnifiedTopology: true});
            try {
                await client.connect();
                const database = client.db("KruaZapp");
                const collection = database.collection("user");
                console.log("id : " + obj + " session : "+ req.session.objid + " phone : " + req.session.phone)

                // console.log(id)
                var query = {
                    _id: ObjectId(obj)
                };
                var value = {
                    $set: {
                        phone: req.session.phone,
                    },
                };
                const result = await collection.updateOne(query,value);
            } catch (err) {
                console.log(err)
            } finally {
                res.redirect('/app')
                client.close()
            }
        }
        insertUser();
    } else {
        res.redirect('/otp/verify?alert=error-otp')
    }
})
module.exports = router