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
      ctx.body = `欢迎订阅～\n\n回复关键字“报名”、“试听”、“课程”可以快速查看相关信息\n`
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
            let str = `订单编号：${item.orderNo}\n校区：${item.campus}\n课程名：${item.course.courseName}\n评分：${item.rate}价格：${item.price}\n学生名：${item.student.studentName}\n日期：${date}\n\n`
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
    let course = []
    let reply
    if (content === '报名' || content === '课程' || content === '正式课程') {
      course = await Course.fetchCourseByType('formal')
      let news = []

      course.slice(0,5).forEach((item) => {
        news.push({
          Title: item.courseName,
          Description: item.introduction,
          PicUrl: item.picUrl,
          Url: `http://3dcec1da.ngrok.io/course/${item._id}`
        })
      })
      reply = news
    } else if (content === '试听' || content === '预约' || content === '试听预约' || content === '试听课程') {
      course = await Course.fetchCourseByType('audition')
      let news = []
      course.slice(0,5).forEach((item) => {
        news.push({
          Title: item.courseName,
          Description: item.introduction,
          PicUrl: item.picUrl,
          Url: `http://3dcec1da.ngrok.io/course/${item._id}`
        })
      })
      reply = news
    }

    ctx.body = reply
  }
  await next()
}