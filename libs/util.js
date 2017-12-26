const fs = require('fs')

const readFileAsync = (fpath, encodnig) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, encodnig, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

const writeFileAsync = (fpath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fpath, content, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}


const timeAgo = (timestamp) => {
  const nowTime = Date.now()
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
    len++
  }
  return num
}

const formatDate = (timestamp) => {
  timestamp = new Date(Number(timestamp))
  const year = timestamp.getFullYear()
  const month = _pad(timestamp.getMonth()+1)
  const day = _pad(timestamp.getDate())
  return `${year}年${month}月${day}日`
}

// 获取本月第一天
const getCurrentMonthFirst = () => {
  const date = new Date()
  date.setDate(1)
  return date
}

const getCurrentMonthLast = () => {
  const date = new Date()
  let currentMonth = date.getMonth()
  let nextMonth = currentMonth + 1
  let nextMonthFirst
  if (nextMonth <= 11) {
    nextMonthFirst = new Date(date.getFullYear(), nextMonth, 1)
  } else {
    nextMonth = 0
    nextMonthFirst = new Date(date.getFullYear() + 1, nextMonth, 1)
  }
  const oneDay = 1000 * 60 * 60 * 24
  return new Date(nextMonthFirst - oneDay)
}

let WEEKDAY = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'  
}

const getWeek = () => {
  let week = {}
  const day = new Date().getDay()
  week[WEEKDAY[day]] = formatDate(+new Date())
  
  let n1 = 1
  for (let i = day - 1; i >= 1; i--) {
    let timestamp = 24 * 60 * 60 * 1000 * n1
    week[WEEKDAY[i]] = formatDate(+new Date() - timestamp)
    ++n1
  }
  
  let n2 = 1
  for (let j = day + 1; j <= 7; j++) {
    let timestamp = 24 * 60 * 60 * 1000 * n2
    week[WEEKDAY[j]] = formatDate(+new Date() + timestamp)
    ++n2
  }
  return week
}

module.exports = {
  formatDate,
  readFileAsync,
  writeFileAsync,
  timeAgo,
  formatDate,
  getCurrentMonthFirst,
  getCurrentMonthLast,
  getWeek
}