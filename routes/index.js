var express = require('express');
const webpush = require('web-push');
var bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const mysql = require('mysql');
var path = require('path');
var router = express.Router();
const async = require('async');
const fetch = require("node-fetch");

var serviceAccount = require("../config/serviceAccount.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

router.post('/search_fcm', (req, res) => {

    const mysqlConnection = mysql.createConnection({
        host: 'hancom-test.c0d1bhka4gti.ap-northeast-2.rds.amazonaws.com', //db ip address
        port: 3306, //db port number
        user: 'admin', //db id
        password: '12345678', //db password
        database: 'firebaseDB' //db schema name
    });
    mysqlConnection.connect(function (err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
        } else {
            let select_query = 'SELECT * FROM firebaseDB.User';
            mysqlConnection.query(select_query, (err1, result, fields) => {
                if (err1) {
                    console.log('mysqlConnection : ' + err1);
                } else {
                    console.log("result.length : " + result.length);
                    async.forEach(result, function (users, callback) {
                        console.log("users : " + users);
                        let url = 'https://iid.googleapis.com/iid/info/' + users.token + '?details=true'
                        console.log("url : " + url);
                        fetch(url, {
                            method: 'GET',
                            headers: {
                                Authorization: "key = AAAA7GaJukU:APA91bGncEU4VLQbCGyH-rMRECahlp2kZj844q_GIzxpqg58AHEPMQhYJwwweHnl9HbcOkW3bWMDp0s2YIYNhx4dI3NxyxgJDChT6QxSBC3U4461nF_r3ROsRiSrPO1u31rW1GS-KMiK",
                                'content-type': 'application/json'
                            }
                        }).then((res) => {
                            console.log("res : ");
                            console.log(res.statusText);
                            if (res.statusText == 'Not Found') {
                                var fcm_delete_query = 'DELETE FROM firebaseDB.User WHERE token = ?';
                                mysqlConnection.query(fcm_delete_query, users.token, (err1, result, fields) => {
                                    if (err1) {
                                        console.log('fcm_delete_query : ' + err1);
                                    } else {
                                        console.log('fcm_delete_query finish');
                                    }
                                })
                            } else { // 실패를 알리는 HTTP 상태 코드면
                                console.error(res.statusText);
                            }
                        }).catch(err => console.error(err));
                    });
                }
            })
        }
    });
    res.status(201).json({});
});

router.post('/fcm_sub', (req, res) => {

    const mysqlConnection = mysql.createConnection({
        host: 'hancom-test.c0d1bhka4gti.ap-northeast-2.rds.amazonaws.com', //db ip address
        port: 3306, //db port number
        user: 'admin', //db id
        password: '12345678', //db password
        database: 'firebaseDB' //db schema name
    });
    let body = req.body;
    let userId = body.userId;
    let token = body.token;
    let other = body.other;
    let insert_query;
    let delete_query;

    let code = 200;
    console.log("userId : " + userId);
    console.log("token : " + token);
    console.log("other : " + other);
    mysqlConnection.connect(function (err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
        } else {
            let token_select_query = 'SELECT * FROM firebaseDB.User WHERE token = ?';
            mysqlConnection.query(token_select_query, token, (err1, result, fields) => {
                if (err1) {
                    console.log('mysqlConnection : ' + err1);
                } else {
                    console.log("result : "+result.length);
                    if(result.length>0){
                        console.log("토큰 중복");
                        console.log("result.user_id : "+result[0].user_id);
                        if(result[0].user_id == userId){
                            console.log("아이디 중복");
                            res.status(code).json({});
                        }
                        else{
                            delete_query = 'DELETE FROM firebaseDB.User WHERE token = ?';
                            mysqlConnection.query(delete_query, token, (err1, result, fields) => {
                                if (err1) {
                                    console.log('mysqlConnection : ' + err1);
                                } else {
                                    console.log('delete_query finish');
                                }
                            })
                            code = 201;
                            res.status(code).json({});
                        }
                    }
                    else{
                        insert_query = 'INSERT INTO firebaseDB.User(user_id,token,server_num,other) VALUES (?,?,?,?);';
                        mysqlConnection.query(insert_query, [userId, token, 1, other], (err1, result, fields) => {
                            if (err1) {
                                console.log('mysqlConnection : ' + err1);
                            } else {
                                console.log('mysqlConnection finish');
                            }
                        })
                        console.log('insert_query');
                        res.status(code).json({});
                    }
                    console.log('mysqlConnection finish');
                }
            })
        }
    });
});

router.get('/fcm_send', (req, res) => {

    const registrationToken = "dsBde_p-TPtqG3L2T8QY6E:APA91bFa8bFg0PJreLZmEa-wK7k9IzidfHBLl6ntX85sB4dAtAlis2RGhOO3b0WbquZZi6QClYHbx5UG8GbrdHJqPOEJM-3_mdrX7JVbxFr3aF5c09szKguwM65LzCPtYGE7PVhzqqRT"

    var payload = {
        token: registrationToken,
        notification: {
            title: "푸시 알림 제목",
            body: "푸시 알림 내용."
        }
    }
    var options = {}
    firebaseAdmin.messaging().send(payload)
        .then(response => {
            console.log("success");

        })
        .catch(error => {
            console.log(error);
        });


    console.log("fcm");
    res.status(201).json({});
})


const publicVapidKey = 'BMEBxPI85QUcEtxr-xrH2qs1Fzl6ed2h7rQKXLuXsT2cR1fcb7EuI57B69J4DxtmP3PDhaVLnP5nK-Dpa0jx_Wo';
const privateVapidKey = '4yt3AgtfVixaZTsw45sXfzfdDowTwWZhvnMkJVTglMs';
webpush.setVapidDetails('jeongseok:test@test.com', publicVapidKey, privateVapidKey);

router.post('/subscribe', (req, res) => {
    const subscription = req.body;

    console.log("여기 들어옴");
    console.log(subscription);
    res.status(201).json({});

    const payload = JSON.stringify({title: 'push Test'});

    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
})
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/fcm_find', (req, res) => {
    const subscription = req.body;
    let userId = subscription.userId;

    console.log("userId : " + userId);

    const mysqlConnection = mysql.createConnection({
        host: 'hancom-test.c0d1bhka4gti.ap-northeast-2.rds.amazonaws.com', //db ip address
        port: 3306, //db port number
        user: 'admin', //db id
        password: '12345678', //db password
        database: 'firebaseDB' //db schema name
    });
    mysqlConnection.connect(function (err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
        } else {
            let select_query = 'SELECT * FROM firebaseDB.User WHERE user_id = ?';
            mysqlConnection.query(select_query, userId, (err1, result, fields) => {
                console.log(result);
                if (err1) {
                    console.log('select_query : ' + err1);
                } else {
                    console.log('select_query finish');
                    res.json({result});
                }
            })
        }
    });
})

module.exports = router;

