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

    const title = "Hello Wor1233ld";
    const options = {
        body: payload.data.status
    };

    return self.registration.showNotification(title,options);
});

self.addEventListener('push', function (event)
{
    console.log('[ServiceWorker] 푸시알림 수신: ', event);

    //Push 정보 조회
    var title = event.data.title || '알림';
    var body = event.data.body;
    var options = {
        body: body
    };

    //Notification 출력
    event.waitUntil(self.registration.showNotification(title, options));
});

//사용자가 Notification을 클릭했을 때
self.addEventListener('notificationclick', function (event)
{
    console.log('[ServiceWorker] 푸시알림 클릭: ', event);

    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" })
            .then(function (clientList)
            {
                //실행된 브라우저가 있으면 Focus
                for (var i = 0; i < clientList.length; i++)
                {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
            })
    );
});

console.log('[ServiceWorker] 시작');