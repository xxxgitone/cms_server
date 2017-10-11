const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const fetchUsers = async (ctx) => {
  const campus = ctx.query.campus ? {campus: ctx.query.campus} : {}
  const userName = ctx.query.name ? {userName: {$regex: ctx.query.name, $options: 'g'}} : {}
  const query = Object.assign(userName, campus)
  const pagenum = Number(ctx.query.pagenum) || 1
  const pagesize = Number(ctx.query.pagesize) || 10
  const total = await User.find(query).count()
  const users = await User.find(query, {password: 0})
    .skip((pagenum - 1) * pagesize)
    .limit(pagesize)
  ctx.body = {
    total,
    code: 0,
    users
  }
}

const fetchUserByToken = async (ctx) => {
  const {id} = ctx.decoded
  const user = await User.findById(id)
  ctx.body = {
    code: 0,
    user
  }
}

const loginOrAddUser = async (ctx) => {
  const userInfo = ctx.request.body
  const {action} = userInfo
  if (action === 'login') {
    const user = await User.findOne({account: userInfo.account})
    if (user != null) {
      if (user.password !== userInfo.password) {
        ctx.body = {
          code: -1,
          msg: '验证失败，密码错误'
        }
      } else {
        const userToken = {
          // account: user.account,
          id: user._id
        }
        const token = jwt.sign(userToken, config.tokenSecret)
        ctx.body = {
          code: 0,
          msg: '登录成功',
          token: token,
          role: user.role
        }
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '用户不存在'
      }
    }
  } else {
    console.log(userInfo)
    const user = await User.find({account: userInfo.account})
    if (user.length > 0) {
      ctx.body = {
        code: -1,
        msg: '账户名已存在'
      }
    } else {
      const newUser = await User.create(userInfo)
      ctx.body = {
        code: 0,
        user: newUser
      }
    }
  }
}

const updateUser = async (ctx) => {
  const userInfo = ctx.request.body
  const _id = userInfo._id
  const user = await User.findOne({_id: _id})
  if (user.account === userInfo.account) {
    const item = await User.update({_id: _id}, userInfo)
    if (item.n) {
      ctx.body = {
        code: 0,
        msg: `修改1条数据成功`
      }
    }
  } else {
    const newUser = await User.find({account: userInfo.account})
    if (newUser.length > 0) {
      ctx.body = {
        code: -1,
        msg: '账户名已存在'
      }
    } else {
      const item = await User.update({_id: _id}, userInfo)
      if (item.n) {
        ctx.body = {
          code: 0,
          msg: `修改1条数据成功`
        }
      }
    }
  }
}

const deleteUser = async (ctx) => {
  const {_id} = ctx.request.query
  if (_id.indexOf(',') > -1) {
    const _ids = _id.split(',')
    const item = await User.remove({_id: {$in: _ids}})
    if (item.result.n > 0) {
      const count = item.result.n
      ctx.body = {
        code: 0,
        msg: `删除${count}条数据成功`
      }
    }
  } else {
    const item = await User.findByIdAndRemove({_id: _id})
    if (item._id) {
      ctx.body = {
        code: 0,
        msg: '删除1条数据成功'
      }
    }
  }
}

module.exports = {
  fetchUsers,
  fetchUserByToken,
  loginOrAddUser,
  updateUser,
  deleteUser
}
