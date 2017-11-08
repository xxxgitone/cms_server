function timeAgo (timestamp) {
  const nowTime = Date.now()
  timestamp = new Date(timestamp)
  const diff = nowTime - timestamp
  const int = parseInt
  let timeAgo
  if (diff < 60 * 1000) {
    timeAgo =  '刚刚'
  } else if (60 * 1000 <= diff && diff < 60 * 60 * 1000) {
    timeAgo = `${int(diff / (60 * 1000))}分钟前`
  } else if (60 * 60 * 1000 <= diff && diff < 24 * 60 * 60 * 1000) {
    timeAgo = `${int(diff / (1000 * 60 * 60))}小时前`
  } else if (24 * 60 * 60 * 1000 <= diff && diff < 30 * 24 * 60 * 60 * 1000) {
    timeAgo = `${int(diff / (1000 * 60 * 60 * 24))}天前`
  } else if (30 * 24 * 60 * 60 * 1000 <= diff && diff < 12 * 30 * 24 * 60 * 60 * 1000) {
    timeAgo = `${int(diff / (1000 * 60 * 60 * 24 * 30))}月前`
  } else {
    timeAgo = `${int(diff / (12 * 30 * 24 * 60 * 60 * 1000))}`
  }

  return timeAgo
}

function _pad (num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len--
  }
  return num
}

function formatDate (timestamp) {
  timestamp = new Date(timestamp)
  const year = timestamp.getFullYear()
  const month = _pad(timestamp.getMonth()+1)
  const day = _pad(timestamp.getDate())
  return `${year}年${month}月${day}日`
}
