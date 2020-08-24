var admin = require("firebase-admin");

var serviceAccount = require("../config/fcm-node-test-a9b79-firebase-adminsdk-33env-5b5f7dc91b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fcm-node-test-a9b79.firebaseio.com"
});



