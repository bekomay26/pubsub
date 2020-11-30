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
const client = redis.createClient(process.env.REDIS_URL);

module.exports = app;
