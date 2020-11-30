require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const subscribeRouter = require('./routes/subscribe');
const publishRouter = require('./routes/publish');

const {subscriptionVerified, getEvents} = require('./controllers/home');


const port = 8000

const app = express();

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



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

const redis = require("redis");
// const client = redis.createClient(6379, 'redis')
// const client = redis.createClient();
// const client = redis.createClient('redis:6379');
// const client = redis.createClient({host: process.env.REDIS_HOST || '127.0.0.1'});
const client = redis.createClient(process.env.REDIS_URL);

module.exports = app;