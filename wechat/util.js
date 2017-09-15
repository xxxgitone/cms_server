const xml2js = require('xml2js')

exports.parseXMLAsync = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

function formatMessage(result) {
  let message = {}
  if (typeof result === 'object') {
    for (key in result) {
      const item = result[key]
      if ((item instanceof Array) && item.length !==0) {
        if (item.length === 1) {
          const val = item[0]
  
          if (typeof val === 'object') {
            message[key] = formatMessage(val)
          } else {
            message[key] = (val || '').trim()
          }
        } else {
          message[key] = []
          item.forEach((m) => {
            message[key].push(formatMessage(m))
          })
        }
      }
    }
  }
  return message
}
exports.formatMessage = formatMessage
