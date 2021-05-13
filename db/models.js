// 1. 引入
// 1.2. 连接
// 1.3. 获取连接对象 测试连接
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/zhipin', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('connected', ()=> {
	console.log('zhipin 数据库连接OK')
})
// 2.1 定义Schema
// 2.2 定义Model (与集合对应，操作集合)
const userSchema = mongoose.Schema({
	username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
  header: {type: String}, // 头像名称
  post: {type: String}, // 职位
  info: {type: String}, // 个人或职位简介
  company: {type: String}, // 公司名称
  salary: {type: String} // 月薪
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel

// 聊天chat 集合/模型
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})

const ChatModel = mongoose.model('chat', chatSchema)

exports.ChatModel = ChatModel