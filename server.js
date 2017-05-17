var express = require('express')
var app = express()

var defaultMessage = 'Please enter a unix timestamp or natural date in the address bar at the end of the url ending in ".io", adding a "/" first'

var dateMaker = function(unix) {
    var date = new Date(unix * 1000)
    return date.toDateString()
}

var unixMaker = function(time) {
    var date = new Date(time)
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()
    return Date.UTC(year, month, day) / 1000
}

app.use(express.static(__dirname))// needed or else index.pug can't find style.css
app.set('views', __dirname)
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render('index', {message: defaultMessage})
})

app.get('/:time', function (req, res) {
    var time = req.params.time//returns a string
    var timeStr = parseInt(time, 10).toString()
    var output
    var unixTime = unixMaker(time)
    if (time === timeStr) {//if equal then 'time' is a number in string format
        output = {'unix timestamp': parseInt(time, 10), 'natural date': dateMaker(time)}
    }
    else if (typeof unixTime == 'number' && !isNaN(unixTime)) {
        output = ({'unix timestamp': unixTime, 'natural date': dateMaker(unixTime)})
    }
    else {
        output = ({'unix timestamp': null, 'natural date': null})
        var additionalMessage = defaultMessage
    }
    res.render('index', {message: JSON.stringify(output), message2: additionalMessage})
})

app.listen(8080)