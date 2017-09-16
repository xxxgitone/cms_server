const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const util = require('./util')
const fs = require('fs')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: prefix + 'token?grant_type=client_credential',
  upload: prefix + 'media/upload?'
}

class Wechat {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appsecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.fetchAccessToken()
  }

  fetchAccessToken () {
    if (this.access_token && this.expires_in) {
      if (this.isValidAccessTooken(this)) {
        console.log(this)
        return Promise.resolve(this)
      }
    }
    return this.getAccessToken()
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
        return Promise.resolve(data)
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

    return new Promise(function(resolve, reject) {
      request({url: url, json: true}).then(function(response) {
          let data = response.body
          const now = Date.now()
          //提前20s
          let expires_in = now + (data.expires_in - 20) * 1000

          data.expires_in = expires_in
          resolve(data)
      })
    })
  }

  reply (ctx) {
    const content = ctx.body
    const message = ctx.weixin
    const xml = util.tpl(content, message)
    ctx.status = 200
    ctx.type = 'application/xml'
    ctx.body = xml
  }
  
  uploadMaterial (type, filepath) {
    let form = {
      media: fs.createReadStream(filepath)
    }

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          const url = `${api.upload}access_token=${data.access_token}&type=${type}`
          request({
            method: 'POST',
            url: url,
            formData: form,
            json: true
          }).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              console.log('cuo')
              throw new Error('upload material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }

}

module.exports = Wechat
