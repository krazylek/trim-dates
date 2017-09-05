var defaults = {
  inclusive: false
}

/**
 * trim a date range to a specific day
 * works with local timezone only
 * @param {Date|Array} day to limit range, or a date range
 * @param {Array<Date|int>} dateRange, has to be ordered [start, end]
 * @param {object} options
 * @returns {Array} trimmed date range
 */
module.exports = function(day, dateRange, options) {
  options = options || defaults
  var dayStart = Array.isArray(day) ? day[0] : floor(day)
  var dayEnd = Array.isArray(day) ? day[1] : ceil(day, options.inclusive)

  console.log(day, [dayStart, dayEnd], dateRange)
  return intersection([dayStart, dayEnd], dateRange)
}

function intersection(a, b) {
  var start = Math.max(a[0], b[0])
  var end = Math.min(a[1], b[1])

  if(start > end)
    return null

  return [new Date(start), new Date(end)]
}

function floor(date) {
  var d = new Date(date)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)

  return d
}

function ceil(date, inclusive) {
  var d = floor(date)
  d.setDate(d.getDate() + 1)

  if(!inclusive)
    d.setMilliseconds(-1)
  //d.setHours(23)
  //d.setMinutes(59)
  //d.setSeconds(59)
  //d.setMilliseconds(999)

  return d
}
