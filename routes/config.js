var admin = require("firebase-admin");

var serviceAccount = require("../config/serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fcm-node-test-a9b79.firebaseio.com"
});



