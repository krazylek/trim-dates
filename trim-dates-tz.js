var trimDay = require('./')
var localOffset = new Date().getTimezoneOffset()
var defaults = { 
  timezoneOffset: 0,
  dayTimezoneOffset: null,
  revertZone: false
}


module.exports = function(day, range, options) {
  options = options || defaults

  var offset = options.timezoneOffset - localOffset
  var dayOffset = options.dayTimezoneOffset ? options.dayTimezoneOffset - localOffset : null

  var tzRange = updateZone(range, offset)
  var tzDay = dayOffset ? updateZone(day, dayOffset) : day
  
  var inter = trimDay(tzDay, tzRange, options)

  if(!inter)
    return null
  
  return options.revertZone ? updateZone(inter, -offset) : inter
}

function updateZone(day, offset) {
  var toLocal = function utc(date) {
    return new Date(date.getTime() - toMs(offset))
  }
  return Array.isArray(day) ? day.map(toLocal) : toLocal(day)
}

function toMs(mn) {
  return mn * 60 * 1000
}
