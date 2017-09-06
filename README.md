# trim-dates

Intersect a date range whith a specific day (or custom range).

Usefull to get any duration that fit (or not) inside a specific day.

You provide a day and a range of two dates, those will be trimmed to fit inside this day.
Sometime you could just want to intersect two date ranges, in this case just specify the range needed.

`trim-dates` works with your environment (browser or node) local timezone. If you need to work with date given in other timezones, check the options in Timezone chapter.


# example

``` js
process.env.TZ = 'Europe/London' // for demo purpose only...

var trimDates = require('trim-dates')
var day = new Date('2017-01-01')
var range = [ 
  new Date('2017-01-01T09:00:00'),
  new Date('2017-02-01T16:00:00')
]
var intersection = trimDates(day, range)

console.log(intersection)

// => [ 2017-01-01T09:00:00.000Z, 2017-01-01T23:59:59.999Z ]
```


# timezones

## the problem

JavaScript only know use current local timezone. For example, executed in +11:00 timezone, the previous example would return:

``` js
var day = new Date('2017-01-01')
var range = [ 
  new Date('2017-01-01T09:00:00'),
  new Date('2017-02-01T16:00:00')
]
var intersection = trimDates(day, range)

console.log(intersection)
// => [ 2016-12-31T22:00:00.000Z, 2017-01-01T12:59:59.999Z ] // because this is diplayed in UTC
```

On the other hand this is what we expect, as the computing was done within the same local timezone.

```js
intersection[0].getDate()
// => 1 // oh!

intersection[0].getHours()
// => 9 // good!

intersection[1].getHours() + ':' + intersection[1].getMinutes()
// => '23:59' // yeah!
```

Unfortunately, sometimes you could want to work with other timezone, which could to lead to unexpected behaviors.

For example:

```js
var day = new Date('2017-01-01T00:00:00-05:00')
var range = [
  new Date('2017-01-01T09:00:00-05:00'),
  new Date('2017-01-02T16:00:00-05:00')
]

console.log(trimDates(day, range))
// => null 
// no intersection in +11:00 timezone!!
```

This is due to the day range creation not being timezone aware.


## trim-dates-tz

To circumvent and ease the use of non local timezone, a small wrapper file is provided.
It allows to specify a timezone offset in minutes to work properly with the given dates.

**Note: this offset is equivalent to `Date.prototype.getTimezoneOffset()`**. 
Which means `2017-01-01T10:00:00+02:00` for a french timezone should be given a **`-120`** offset.

Finaly, by defaults the returned range is in local timezone, so the above date would gives `10` when calling `getHours()`.
This is usualy convenient, but it modifies the date value. If your goal is to keep original, add `revertTimezone: true` to options.


### example

```js
var trimDatesTz = require('trim-dates/trim-dates-tz')
var day = new Date('2017-01-01T00:00:00-05:00')
var range = [
  new Date('2017-01-01T09:00:00-05:00'),
  new Date('2017-01-02T16:00:00-05:00')
]
trimDatesTz(day, range, { timezoneOffset: 5 * 60 })
```


### other options

There is other options to work with non local timezone:


- define the range in the required timezone by yourself:

```js
var day = [
  new Date('2017-01-01T00:00:00-05:00'),
  new Date('2017-01-01T23:59:00-05:00')
]
var range = [
  new Date('2017-01-01T09:00:00-05:00'),
  new Date('2017-01-02T16:00:00-05:00')
]
trimDates(day, range, { timezoneOffset: 5 * 60 })

// => [ 2017-01-01T14:00:00.000Z, 2017-01-02T04:59:00.000Z ] // local timezone anyway, but meaningfull result!
```

- remove timezone informations from all of your dates by yourself, and work in local time as the browser/nodejs does.

Something like:

```js
var day = new Date('2017-01-01T00:00:00-05:00'.splice(0, 19))
```

Will work as well with your local timezone.


# api

```js
var trimDates = require('trim-dates')
```

## var intersection = trimDates(dayDate, dateRange, [opts])

Return an array of two dates if an intersection is found, or null.
All provided dates couldbe either Date object or timestamp.

* `dayDate` - the day to intersect your range with. Optionaly you can provide your own range array: `[startDate, endDate]`.
* `dateRange` - the date range to be trimmed to fit inside the provided day. Hqave to be ordered: `[startDate, endDate]`.
* `opts.inclusive` - default `false`. If you want to include the last millisecond, so the day range is from current day 00:00 to next day 00:00.

---

If using `trim-dates-tz`, you get a few more options:`

```js
var trimDatesTz = require('trim-dates/trim-dates-tz')
```

## var intersection = trimDatesTz(dayDate, dateRange, [opts])

Signature is similar to `trim-dates`. The result is stil a Date array in **local** time.
Here are the added options:

* `opts.timezoneOffset` - default: `0`. Timezone offset in minutes from UTC time. **This is similar to js `getTimezoneOffset()` but **inverse of momentjs `utcOffset()`**.
* `opts.revertZone` - default: `false`. In case you prefer the result to keep it's original value.
* `dayTimezoneOffset` - default: `null`. Similat to timezoneOffset, but adapt the day if in another timezone.


# license

MIT


# install

```
npm install trim-dates
```
