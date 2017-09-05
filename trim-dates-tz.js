var trimDay = require('./')
var localOffset = new Date().getTimezoneOffset()
var defaults = { tzOffset: 0, revertZone: false }


module.exports = function(day, range, options) {
  options = options || defaults
  var fullOffset = options.tzOffset - localOffset
  var toLocal = changeOffset(fullOffset)
  var tzDay = Array.isArray(day) ? day.map(toLocal) : toLocal(day)
  var tzRange = range.map(toLocal)

  var inter = trimDay(tzDay, tzRange, options)

  if(!inter)
    return null
  
  return options.revertZone ? inter.map(changeOffset(-fullOffset)) : inter
}

function changeOffset(tzOffset) {
  return function utc(date) {
    return new Date(date.getTime() - toMs(tzOffset))
  }
}

function toMs(mn) {
  return mn * 60 * 1000
}