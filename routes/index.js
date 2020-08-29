var express = require('express');
const webpush = require('web-push');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

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

