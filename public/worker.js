self.addEventListener('push', function(event) {
    //푸시 리스너
    var payload = event.data.json();
    const title = payload.title;
    const options = {
    };
    event.waitUntil( self.registration.showNotification(title, options) );
});
