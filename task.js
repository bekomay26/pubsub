const Queue = require('bull');
const axios = require('axios');
const crypto = require('crypto');
const {db} = require('./database');

// const publishingQueue = new Queue('update subscribers');
// const intentQueue = new Queue('verify subscriber');

const publishingQueue = new Queue('update subscribers', process.env.REDIS_URL);
const intentQueue = new Queue('verify subscriber', process.env.REDIS_URL);

// const job = await publishingQueue.add({
//   topic: 'bar',
//   message: ''
// });

// Workers
publishingQueue.process(async (job) => {
  return sendUpdateToSubscriber(job.data);
});

intentQueue.process(async (job) => {
  return verifyIntent(job.data);
});

// Listeners
// Define a local completed event
publishingQueue.on('completed', (job, result) => {
  console.log(`update sent to ${job.data.url} completed`);
})

publishingQueue.on('failed', function(job, err){
  console.log(`update failed to send to ${job.data.url} completed`);
})

// intentQueue.on('completed', (job, result) => {
//   console.log(`Subscriber intent verified with result ${result}`);
//
// })
//
// intentQueue.on('failed', function(job, err){
//   // A job failed with reason `err`!
// })

exports.addJobForEachSubscriber = async (topic, updateBody) => {

  const subscribers = await db.any('SELECT * FROM subscribers WHERE topic = $1', [topic]);
  subscribers.forEach(sub => {
    // Delayed for 1 second and is retried 5 times on fail
    publishingQueue.add({
      url: sub.callback_url,
      topic,
      body: updateBody
    }, { delay: 1000, attempts: 5 });
  })
}

const sendUpdateToSubscriber = async (data) => {
  await axios.post(data.url, {update: data.body, topic: data.topic});

}

exports.addJobToVerifySubscriberIntent = async ({callbackUrl, mode, topic, topicId}) => {
  intentQueue.add({callbackUrl, mode, topic, topicId});

}



/*
* ensure that the subscriber did indeed send the subscription request
*/
const verifyIntent = async ({callbackUrl, mode, topic, topicId}) => {
  // const challenge = Math.random().toString(36).substr(2, 10); // generates a random string
  const challenge = crypto.randomBytes(5).toString('hex'); // generates a  random string
  let verification_status = ''
  try {
    const response = await axios.get(`${callbackUrl}?mode=${mode}&topic=${topic}&challenge=${challenge}`);
    if (response.status % 100 === 2 && response.data.challenge === challenge) {
      // await db.none(
      //   'INSERT INTO subscribers(callback_url, topic_id, status, topic) VALUES($1, $2, $3, $4) ON CONFLICT (callback_url) DO UPDATE SET status = ($3)',
      //   [callbackUrl, topicId, mode, topic]
      // )
      await db.none(
        'INSERT INTO subscribers(callback_url, topic_id, status, topic) VALUES($1, $2, $3, $4) ON CONFLICT (callback_url) DO UPDATE SET status = ($3)',
        [callbackUrl, topicId, mode, topic]
      );
      verification_status = 'ACCEPTED';
    } else {
      verification_status =  'DECLINED';
    }
    // Notify subscriber of the status of the verification
    await axios.post(`${callbackUrl}/verified`, {topic, status: verification_status});
    return verification_status;
  }
  catch(error) {
    console.log(error);
  }
}