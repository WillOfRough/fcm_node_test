const async = require('async'); // kevin added
let user_id = [1,2,3,4,5];
async.forEach(user_id,function(user_idx,play ){
    console.log(user_idx);
    play();
    return;
});

console.log("123");

socket.on('FIRE_MEN', function(roomNum, data) {
    console.log('[FIRE_MEN] : ' + roomNum);
    console.log(data);

    gameModule.leaveUser(roomNum, data.SOCKET);
    game.to(data.SOCKET).emit('YOU_FIRE');
    game.connected[data.SOCKET].leave(roomNum, function() {});
    game.to(roomNum).emit('UPDATE_MEMBERS', {
        USER_INFO: gameModule.getUserInfo(roomNum),
        MASTER: gameModule.getMaster(roomNum),
        CLAN: gameModule.getClanInfo(roomNum)
    });
    var current = gameModule.currentMemberNumber(roomNum);
    robbyModule.updateMemberNum(roomNum, current);
});


/* 방 나가기 */
socket.on('LEAVE_ROOM', function(roomNum) {
    console.log('[LEAVE_ROOM] : ' + roomNum);
    socket.leave(roomNum, function() {
        gameModule.leaveUser(roomNum, socket.id);
        game.to(socket.id).emit('LEAVE_ROOM');
        game.to(roomNum).emit('UPDATE_MEMBERS', {
            USER_INFO: gameModule.getUserInfo(roomNum),
            MASTER: gameModule.getMaster(roomNum),
            CLAN: gameModule.getClanInfo(roomNum)
        });
        var current = gameModule.currentMemberNumber(roomNum);
        if (current == 0) {
            // 방 삭제, 번호 번환
            gameModule.removeRoom(roomNum);
            robbyModule.removeRoom(roomNum);
        } else {
            robbyModule.updateMemberNum(roomNum, current);
        }
    });
});