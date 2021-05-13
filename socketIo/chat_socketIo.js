const {ChatModel} = require('../db/models')
module.exports = function (serve) {

	console.log('chat socktIO')

	const io = require('socket.io')(serve)

	io.on('connection', function(socket){
		console.log('连接数+1')
		// 绑定监听，接收客户端发送的消息
		socket.on('sendMsg', function ({from, to, content}) {
			//处理数据  保存消息  根据Schema定义所需的字段 组合一个新的对象
			const chat_id = [from, to].sort().join('_')
			const create_time = Date.now()
			new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
				//保存成功 向客户端发送消息
				io.emit('receiveMsg',chatMsg)
			})
			
		})
	})
}