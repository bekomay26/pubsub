require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('../routes/home');
var usersRouter = require('../routes/users');
var subscribeRouter = require('../routes/subscribe');
var publishRouter = require('../routes/publish');

var {subscriptionVerified, getEvents} = require('../controllers/home');


const port = 8000

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/subscribe', subscribeRouter);
app.use('/publish', publishRouter);



app.post('/verified', subscriptionVerified);
app.get('/event', getEvents);

const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

module.exports = app;
