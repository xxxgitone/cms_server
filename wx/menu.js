module.exports = {
  button: [
    {
      type: 'view',
      name: '报名预约',
      url: 'https://82775cdc.ngrok.io/oauth'
    },
    {
      type: 'view',
      name: '教师风采',
      url: 'https://82775cdc.ngrok.io/oauth'
    },
    {
      name: '我的信息',
      sub_button: [
        {
          "type":"click",
          "name":"我的订单",
          "key":"myOrder"
        },
        {
          "type":"click",
          "name":"我的课程",
          "key":"myCourse"
        },
        {
          "type":"click",
          "name":"我的试听",
          "key":"myAudition"
        }
      ]
    }
  ]
}