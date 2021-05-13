const md5 = require('blueimp-md5')
// 1.1 引入mongoose
const mongoose = require('mongoose')
const { connect } = require('../app')
// 1.2 连接指定数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test', {useNewUrlParser: true, useUnifiedTopology: true})
// 1.3 获取连接对象
// const conn = 
// 1.4 绑定连接完成的监听
const db = mongoose.connection;
db.on('connected', function(){
	console.log('数据库连接成功')
})

// 2.1 定义Schema
const userSchema = mongoose.Schema({
	username: {type: String, require: true},
	password: {type: String, require: true},
	type: {type: String, require: true},
	header: {type: String,}
})
// 2.2 定义Model (与集合对应，操作集合)
const UserModel = mongoose.model('user', userSchema)

// 3. 通过Model或其他实例对集合 CRUD 操作
function testSave(){
	const userModel = new UserModel({username: 'Tom', password: md5('123'), type: 'dashen'})
	userModel.save(function(error, user){
		console.log('save()',error, user)
	})
}
// testSave()
function testFind(){
	UserModel.find({_id:'6094100fec1506365cddb672'}, function(error, users){
		console.log('fin()',error, users)
	})
}function testFindOne(){
	UserModel.findOne({_id:'6094100fec1506365cddb672'}, function(error, user){
		console.log('finOne()',error, user)
	})
}
// testFind()
// testFindOne()
//测试更新
function testUpdata(){
	UserModel.findByIdAndUpdate({_id:'6094100fec1506365cddb672'},{name: 'jack'},function(error, oldUser){
		console.log('findByIdAndUpdate',error, oldUser)
	})
}
// testUpdata()

function testDelete(){
	UserModel.remove({_id:'6094100fec1506365cddb672'}, function(error, doc){
		console.log('remove()',error,doc)
	})
}
testDelete()