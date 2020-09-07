var express = require('express');
const webpush = require('web-push');
var bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
var path = require('path');
var router = express.Router();

var serviceAccount = require("../config/serviceAccount.json");
firebaseAdmin.initializeApp({
  credential : firebaseAdmin.credential.applicationDefault(serviceAccount)
});

router.get('/fcm_send',(req,res) =>{

  const  registrationToken = "dsBde_p-TPtqG3L2T8QY6E:APA91bFa8bFg0PJreLZmEa-wK7k9IzidfHBLl6ntX85sB4dAtAlis2RGhOO3b0WbquZZi6QClYHbx5UG8GbrdHJqPOEJM-3_mdrX7JVbxFr3aF5c09szKguwM65LzCPtYGE7PVhzqqRT"

  var payload ={
    token:registrationToken,
    notification: {
      title: "푸시 알림 제목",
      body : "푸시 알림 내용."
    }
  }
  var options ={

  }
  firebaseAdmin.messaging().send(payload)
      .then( response => {
        console.log("success");

      })
      .catch( error => {
        console.log(error);
      });


  console.log("fcm");
  res.status(201).json({});
})




const publicVapidKey = 'BMEBxPI85QUcEtxr-xrH2qs1Fzl6ed2h7rQKXLuXsT2cR1fcb7EuI57B69J4DxtmP3PDhaVLnP5nK-Dpa0jx_Wo';
const privateVapidKey = '4yt3AgtfVixaZTsw45sXfzfdDowTwWZhvnMkJVTglMs';
webpush.setVapidDetails('jeongseok:test@test.com',publicVapidKey,privateVapidKey);

router.post('/subscribe',(req,res) =>{
  const subscription = req.body;

  console.log("여기 들어옴");
  console.log(subscription);
  res.status(201).json({});

  const payload = JSON.stringify({title: 'push Test'});

  webpush.sendNotification(subscription,payload).catch(err =>console.error(err));
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
module.exports = router;

