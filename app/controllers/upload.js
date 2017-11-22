const qiniu = require('qiniu')
const qnConfig = require('../../config/qiniu.config')
const mac = new qiniu.auth.digest.Mac(qnConfig.accessKey, qnConfig.secretKey)
const options = {
  scope: qnConfig.bucket
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

let config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
const localFile = '/home/xuthus/Pictures/github.png'
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()
const key = 'test.png'

formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,respBody, respInfo) {
  if (respErr) {
    throw respErr
  }

  if (respInfo.statusCode == 200) {
    console.log(respBody)
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
})
