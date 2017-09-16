const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const util = require('./util')
const fs = require('fs')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
  accessToken: prefix + 'token?grant_type=client_credential',
  temporary: {
    upload: prefix + 'media/upload?',
    fetch: prefix + 'media/get?'
  },
  permanent: {
    upload: prefix + 'material/add_material?',
    fetch: prefix + 'material/get_material?',
    uploadNews: prefix + 'material/add_news?',
    uploadNewsPic: prefix + 'media/uploadimg',
    del: prefix + 'material/del_material?',
    update: prefix + 'material/update_news?',
    count: prefix + 'material/get_materialcount?',
    batch: prefix + 'material/batchget_material?'
  }
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
  
  /**
   * 上传素材方法，素材类型分为临时和永久素材
   * @param {类型，图文，图片...} type 
   * @param {如果是图文传入数组，如不是则传入路径} material 
   * @param {可选，传入的话即表示为永久素材} permanent 
   */
  uploadMaterial (type, material, permanent) {
    let form = {}
    let uploadUrl = api.temporary.upload

    if (permanent) {
      uploadUrl = api.permanent.upload
      Object.assign(form, permanent)
    }

    if (type === 'pic') {
      uploadUrl = api.permanent.uploadNewsPic
    }

    if (type === 'news') {
      uploadUrl = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${uploadUrl}access_token=${data.access_token}`

          if (!permanent) {
            url += `&type=${type}`
          } else {
            form.access_token = data.access_token
          }

          let options = {
            method: 'POST',
            url: url,
            json: true
          }

          if (type === 'news') {
            options.body = form
          } else {
            options.formData = form
          }

          request(options).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              throw new Error('upload material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }

  /**
   * 获取素材方法
   * @param {素材的media_id} mediaId 
   * @param {类型} type 
   * @param {*} permanent 
   */
  fetchMaterial (mediaId, type, permanent) {
    let fetchdUrl = api.temporary.fetch

    if (permanent) {
      fetchdUrl = api.permanent.fetch
    }

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${fetchdUrl}access_token=${data.access_token}`

          let options = {
            method: 'POST',
            url: url,
            json: true
          }
          let form = {}
          if (permanent) {
            form.media_id = mediaId
            form.access_token = data.access_token
            options.body = form
          } else {
            if (type === 'video') {
              url.replace('https://', 'http://')
            }
            url += `&media_id=` + mediaId
          }

          if (type === 'news' || type === 'video') {
            request(options).then((res) => {
              const _data = res.body
              if (_data) {
                resolve(_data)
              } else {
                throw new Error('fetch material fails')
              }
            }).catch((err) => {
              reject(err)
            })
          } else {
            resolve(url)
          }
        })
    })
  }

  /**
   * 删除永久素材
   * @param {*} mediaId 
   */
  deleteMaterial (mediaId) {
    let form = {
      media_id: mediaId
    }

    let delUrl = api.permanent.del

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${delUrl}access_token=${data.access_token}`
          request({
            method: 'POST',
            url: url,
            body: form,
            json: true
          }).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              throw new Error('delete material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }

  updateMaterial (mediaId, news) {
    let form = {
      media_id: mediaId
    }

    Object.assign(form, news)

    let updateUrl = api.permanent.update

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${updateUrl}access_token=${data.access_token}`
          request({
            method: 'POST',
            url: url,
            body: form,
            json: true
          }).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              throw new Error('upload material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }

  // 获取素材总数
  countMaterial () {

    let countUrl = api.permanent.count

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${countUrl}access_token=${data.access_token}`
          request({
            method: 'GET',
            url: url,
            json: true
          }).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              throw new Error('count material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }

  // 获取素材列表
  batchMaterial (options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 1
    
    let batchUrl = api.permanent.batch

    return new Promise((resolve, reject) => {
      this.fetchAccessToken()
        .then((data) => {
          let url = `${batchUrl}access_token=${data.access_token}`
          request({
            method: 'POST',
            url: url,
            body: options,
            json: true
          }).then((res) => {
            const _data = res.body
            if (_data) {
              resolve(_data)
            } else {
              throw new Error('batch material fails')
            }
          }).catch((err) => {
            reject(err)
          })
        })
    })
  }


}

module.exports = Wechat
