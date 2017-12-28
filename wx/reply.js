const path = require('path')
const wx = require('./index')
const wechatApi = wx.getWechat()
const util = require('../libs/util')
const Course = require('../app/models/course')
const Order = require('../app/models/order')
const Student = require('../app/models/student')
const Audition = require('../app/models/audition')


/**
 * 根据用户的请求信息，返回相应的内容
 */
exports.reply = async (ctx, next) => {
  const message = ctx.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫毛二维码: ' + message.EventKey + ' ' + message.Ticket)
      }
      ctx.body = `欢迎订阅～\n\n回复课程关键字，可以快速查看相关信息\n`
    } else if (message.Event === 'unsubscribe') {
      ctx.body= ''
      console.log('取消关注')
    } else if (message.Event === 'CLICK') {
      const fromOpenid = message.FromUserName
      const eventKey = message.EventKey
      let data = []
      let headStr = ''
      let replys = []
      if (message.EventKey === 'myOrder') {
        data = await Order.fetchOrdersByFromOpenid(fromOpenid)
        if (data.length > 0) {
          headStr = '您的订单信息如下\n\n'
          data.forEach(item => {
            const date = util.formatDate(item.date)
            let str = `订单编号：${item.orderNo}\n校区：${item.campus}\n课程名：${item.course.courseName}\n价格：${item.price}\n学生名：${item.student.studentName}\n日期：${date}\n\n`
            replys.push(str)
          })
        } else {
          headStr = '暂无订单信息'
        }
      } else if (eventKey === 'myCourse') {
        const  student = await Student.find({fromOpenid}).populate('course')
        // 通过这个微信用户报名的学员可能有多个
        if (Array.isArray(student)) {
          student.forEach((item) => {
            data = [...data, ...item.course]
          })
        }
        if (data.length > 0) {
          headStr = '您的课程信息如下\n\n'
          data.forEach(item => {
            const date = util.formatDate(item.startDate)
            let str = `课程名：${item.courseName}\n校区：${item.campus}\n教师：${item.teacher}\n价格：${item.price}\n课时：${item.period}/课时\n开始日期：${date}\n\n`
            replys.push(str)
          })
        } else {
          headStr = '暂无课程信息'
        }
      } else if (eventKey === 'myAudition') {
        data = await Audition.fetchAuditionByFromOpenid(fromOpenid)
        if (data.length > 0) {
          headStr = '您的试听信息如下\n\n'
          data.forEach(item => {
            const date = util.formatDate(item.createAt)
            let str = `课程名：${item.course.courseName}\n校区：${item.course.campus}\n教师：${item.course.teacher}\n学生名：${item.studentName}\n日期：${date}\n\n`
            replys.push(str)
            replys.push(str)
          })
        } else {
          headStr = '暂无试听信息'
        }
      }
      ctx.body = `${headStr}${replys.join('')}`
    }
  } else if (message.MsgType === 'text'){
    const content = message.Content
    let news = []
    let course = await Course.fetchCourseByName(content)
    if (course.length === 0) {
      course = await Course.fetchCourseByTag(content)
    }
    course.forEach((item) => {
      news.push({
        Title: item.courseName,
        Description: item.introduction,
        PicUrl: item.picUrl,
        Url: `https://cc4f67ad.ngrok.io/course/${item._id}`
      })
    })
    ctx.body = news.length > 0 ? news : '没有相关信息'
  }
  await next()
}