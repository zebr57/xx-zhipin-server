module.exports = function (serve) {
	console.log('模块引入io')
	const io = require('socket.io')(serve)

	io.on('connection', function(socket){
		console.log('连接数+1')
		// 绑定监听，接收客户端发送的消息
		socket.on('sendMsg', function (data) {
			console.log('服务器接收到消息',data);
			// data.name = data.name.toUpperCase()
			socket.emit('receiveMsg', data)
			console.log('发送监听事件receiveMsg', data)
		})
	})
}