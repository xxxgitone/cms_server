const path = require('path')
const util = require('../libs/util')
const wechat_file = path.join(__dirname, './wechat.txt')
const config = {
  wechat: {
    appID: 'wxb37838238b63dfad',
    appsecret: '7dd0fbce66d033e1c8ceb0d7316c7937',
    token: 'weixin15270597572kaifa',
    getAccessToken: () => {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: (data) => {
      data = JSON.stringify(data)
      return util.writeFileAsync(wechat_file, data)
    }
  }
}

module.exports = config