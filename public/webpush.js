importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyClNFoKocaycrGI42gTaBcYINw0d55t--4",
    authDomain: "fcm-node-test-a9b79.firebaseapp.com",
    databaseURL: "https://fcm-node-test-a9b79.firebaseio.com",
    projectId: "fcm-node-test-a9b79",
    storageBucket: "fcm-node-test-a9b79.appspot.com",
    messagingSenderId: "1015332584005",
    appId: "1:1015332584005:web:ca3292d06cd4b5bcf9012c",
    measurementId: "G-3EJ6VQC9J1"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
    console.log(payload);

    console.log("payload");

    const title = "payload";
    const options = {
        body: payload.data.status
    };

    return self.registration.showNotification(title,options);
});