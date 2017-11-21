module.exports = {
  button: [
    {
      type: 'view',
      name: '报名预约',
      url: 'http://f5cf6435.ngrok.io/oauth'
    },
    {
      type: 'view',
      name: '教师风采',
      url: 'http://f5cf6435.ngrok.io/oauth'
    },
    {
      name: '我的信息',
      sub_button: [
        {
          type: 'scancode_push',
          name: '扫码推送事件',
          key: 'qr_scan'
        }
      ]
    }
  ]
}