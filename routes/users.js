var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const fetch = require("node-fetch");

/* GET users listing. */

router.get('/', function (req, res, next) {
    res.render('test1', {title: 'Express'});
});
router.get('/checkManager', function (req, res, next) {
    const mysqlConnection = mysql.createConnection({
        host: 'hancom-test.c0d1bhka4gti.ap-northeast-2.rds.amazonaws.com', //db ip address
        port: 3306, //db port number
        user: 'admin', //db id
        password: '12345678', //db password
        database: 'firebaseDB' //db schema name
    });
    let accountId;
    let getUserInfoUrl = 'https://dev-api.malangmalang.com/accounts/v1/sessions'
    fetch(getUserInfoUrl, {
        method: 'GET',
        headers: {
            'x-mplatform-api-sid': "e3d19289-86ee-48d2-b20d-3a06e0be89e8"
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log(response.sessions[0].account_id);
        });
    mysqlConnection.connect(function (err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
        } else {
            let select_query = 'SELECT * FROM firebaseDB.User';
            mysqlConnection.query(select_query, (err1, result, fields) => {

            })
        }
    });
    res.status(201).json({});
});
module.exports = router;
