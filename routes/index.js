var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const secret = 'Spider-Man'

const { UserModel, ChatModel } = require('../db/models');
const md5 = require('blueimp-md5')
const filter = { password: 0, __v: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST register page. */
router.post('/register', function(req, res, next) {
  // 1. 获取数据
  const { username, password, type } = req.body
  // 2. 处理 
  UserModel.findOne({username}, function(error, user){
    if (user) {
    // 3. 返回响应数据
      res.send({code: 1, msg: '该用户已存在'})
    } else {
      console.log('else run')
      new UserModel({username, password: md5(password), type}).save(function(error, user){
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
        const data = {username, type, _id: user.id}
        res.send({code: 0, data})
      })
    }
  })
});

/* POST login page. */
router.post('/login', function(req, res){
  const { username, password } = req.body
  UserModel.findOne({username, password :md5(password)}, filter, function(error, user){
    if(user) {

      res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
      res.send({code: 0, data: user})
    } else {
      res.send({code: 1, msg: '用户名或密码不正确'})
    }
  })
})

//更新用户信息的路由
router.post('/update', function (req,res) {
  //从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在，返回一个提示信息
  if(!userid){
    return res.send({code: 1, msg: '请先登录'})
  }
  // 存在
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
    //如果意外没有匹配数据，说明这个userid出问题
    if (!oldUser) {
      res.clearCookie('userid') //通知浏览器干掉
    } else {
      //准备一个返回的user对象
      const {_id, username, type } = oldUser
      const data = Object.assign({_id, username, type}, user)
      res.send({code: 0, data})
    }
  })
})

//获取用户信息
router.get('/user', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({code: 1, msg: '请先登录'})
  }
  //根据id返回对象
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code: 0, data: user})
  })
})

//根据类型获取用户列表
router.get('/userList', function (req, res) {
  const { type } = req.query
  UserModel.find({type}, filter, function (error, users) {
    if (!['master', 'boss'].includes(type)) {
      res.send({code: 1, error, msg: '指定类型type错误'})
    }else {
      res.send({code: 0, data: users})
    }
  })
})

router.get('/msglist', function (req, res) {
  console.log('msglist')
  const userid = req.cookies.userid
  //找出所有user 组成所需的数据结构
  UserModel.find(function (error, userDocs) {
    // const users = {} // 对象容器
    // userDocs.forEach(doc => {
    //   users[doc._id] = {username: doc.username, header: doc.header}
    // })
    const users = userDocs.reduce((users, user)=>{
      users[user._id] = {username: user.username, header: user.header}
      return users
    },{})
    ChatModel.find({'$or':[{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // console.log('ChatModel',chatMsgs)cl
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

router.post('/readmsg',function(req, res){
  const from = req.body.from
  const to = req.cookies.userid
  // console.log(from)
  // console.log(to)
    /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  //找到谁发给我的那条记录 from谁 to我
  ChatModel.updateMany({from, to, read: false}, {'$set':{read: true}}, function(err, doc){
    // console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified})
  })
})

module.exports = router;
