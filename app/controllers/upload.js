const qiniu = require('qiniu')
const qnConfig = require('../../config/qiniu.config')

exports.upload2qiniu = (localFile, key) => {
  const mac = new qiniu.auth.digest.Mac(qnConfig.accessKey, qnConfig.secretKey)
  const options = {
    scope: qnConfig.bucket
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  
  let config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z0
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,respBody, respInfo) {
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        const url = `http://ou1r84eii.bkt.clouddn.com/${respBody.key}`
        resolve({url})
      } else {
        resolve(respInfo.statusCode, respBody)
      }
    })
  })
}

