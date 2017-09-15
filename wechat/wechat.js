const axios = require('axios')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: prefix + 'token?grant_type=client_credential'
}

class Wechat {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appsecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getAccessToken()
      .then((data) => {
        try {
          data = JSON.parse(data)
        } catch(e) {
          return this.updateAccessToken(data)
        }

        if (this.isValidAccessTooken(data)) {
          return Promise.resolve(data)
        } else {
          return this.updateAccessToken()
        }
      })
      .then((data) => {
        this.access_token = data.access_token
        this.expires_in = data.access_token
        this.saveAccessToken(data)
      })
  }

  // 验证票据
  isValidAccessTooken (data) {
    if (!data || !data.access_token || !data.expires_in) {
      return false
    }
    const access_token = data.access_token
    const expires_in = data.expires_in
    const now = Date.now()

    if (now < expires_in) {
      return true
    } else {
      return false
    }
  }

  // 更新票据
  updateAccessToken () {
    const appID = this.appID
    const appSecret = this.appSecret
    const url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret

    return axios.get(url).then((res) => {
      const data = res.data
      const now = Date.now()
      const expires_in = now + (data.expires_in - 20) * 1000
      data.expires_in = expires_in
      return Promise.resolve(data)
    })
  }

}

module.exports = Wechat
