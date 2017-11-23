const router = require('koa-router')()
const multer = require('koa-multer')
const fs = require('fs')
const path = require('path')
const uploadController = require('../controllers/upload')

const removeFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err)
    }
    console.log('删除')
  })
} 

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

// upload.sing('image') 与传过来的字段名相同
router.post('/upload', upload.single('image'), async (ctx) => {
  const {file} = ctx.req
  if (file) {
    const localfile = path.join(__dirname, '../../', file.path)
    const key = file.filename
    const result = await uploadController.upload2qiniu(localfile, key)
    if (result.url) {
      ctx.body = {
        code: 0,
        msg: '上传成功',
        url: result.url
      }
      removeFile(localfile)
    } else {
      ctx.body = {
        code: -1,
        msg: '上传失败'
      }
      removeFile(localfile)
    }
  }
})

module.exports = router