var trimDates = require('../')
var trimDatesTz = require('../trim-dates-tz')
var test = require('tape')


test('check Date.prototype.toLocaleTimeString works as expected', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  t.equal(day.toLocaleTimeString(), '02:00:00')
  t.end()
})

test('intersecting inside selected day gives the whole day range', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  var start = new Date('2017-01-01T09:00:00')
  var end = new Date('2017-01-01T16:00:00')
  var inter = trimDates(day, [start, end])

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '09:00:00 - 16:00:00')
  t.equal(inter[0].toLocaleTimeString(), start.toLocaleTimeString())
  t.equal(inter[1].toLocaleTimeString(), end.toLocaleTimeString())
  t.end()
})

test('dates could be timestamps', function (t) {
  var day = new Date('2017-01-01T02:00:00').getTime()
  var start = new Date('2017-01-01T09:00:00').getTime()
  var end = new Date('2017-01-01T16:00:00').getTime()
  var inter = trimDates(day, [start, end])

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '09:00:00 - 16:00:00')
  t.equal(inter[0].getTime(), start)
  t.equal(inter[1].getTime(), end)
  t.end()
})

test('intersecting outside selected day gives trimmed range, end finish after day', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  var start = new Date('2017-01-01T09:00:00')
  var end = new Date('2017-01-02T16:00:00')
  var inter = trimDates(day, [start, end])

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '09:00:00 - 23:59:59')
  t.equal(inter[1].getDate(), day.getDate())
  t.end()
})

test('intersecting outside selected day gives inclusive trimmed range if specified', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  var start = new Date('2017-01-01T09:00:00')
  var end = new Date('2017-01-02T16:00:00')
  var inter = trimDates(day, [start, end], { inclusive: true })

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '09:00:00 - 00:00:00')
  t.equal(inter[1].getDate(), 2)
  t.end()
})

test('intersecting outside selected day gives trimmed range, start begins before day', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  var start = new Date('2016-12-31T09:00:00')
  var end = new Date('2017-01-01T16:00:00')
  var inter = trimDates(day, [start, end])

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '00:00:00 - 16:00:00')
  t.equal(inter[0].getDate(), day.getDate())
  t.end()
})

test('intersecting outside selected day gives trimmed range, start begins before day, end finish after day', function (t) {
  var day = new Date('2017-01-01T02:00:00')
  var start = new Date('2016-12-31T09:00:00')
  var end = new Date('2017-02-01T16:00:00')
  var inter = trimDates(day, [start, end])

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '00:00:00 - 23:59:59')
  t.equal(inter[0].getDate(), day.getDate())
  t.equal(inter[1].getDate(), day.getDate())
  t.end()
})

test('intersecting inside same day is working in another timezone', function (t) {
  var day = new Date('2017-01-01T02:00:00-05:00')
  var start = new Date('2017-01-01T09:00:00-05:00')
  var end = new Date('2017-01-01T16:00:00-05:00')
  var inter = trimDatesTz(day, [start, end], { tzOffset: 5 *60})

  t.ok(Array.isArray(inter))
  t.equal(`${inter[0].toLocaleTimeString()} - ${inter[1].toLocaleTimeString()}`, '09:00:00 - 16:00:00')
  t.end()
})

test('intersecting in another timezone, and reverting to original timezone', function (t) {
  var day = new Date('2017-01-01T02:00:00-05:00')
  var start = new Date('2017-01-01T09:00:00-05:00')
  var end = new Date('2017-01-01T16:00:00-05:00')
  var inter = trimDatesTz(day, [start, end], { tzOffset: 5 *60, revertZone: true })

  t.ok(Array.isArray(inter))
  t.equal(inter[0].toISOString(), start.toISOString())
  t.equal(inter[1].toISOString(), end.toISOString())
  t.end()
})
