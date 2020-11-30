const {addJobToVerifySubscriberIntent} = require('../task');
const {isValidUrl} = require('../utils');
const {db} = require('../database');


exports.subscribe = async (req, res ) => {
  const { topic } = req.params;
  const callbackUrl = req.body.url;
  const mode = req.body.mode || 'subscribe';

  if(!isValidUrl(callbackUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid URL',
    });
  }

  if(topic.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Topic must not be empty',
    });
  }

  // remove params and query strings from URL
  const urlWithoutParams = callbackUrl.match('^(?:\\/\\/|[^\\/]+)*')[0];

  // Save the pending subscription
  try {

    const subscriptionEntryAlreadyExisting =
      await db.any('SELECT (status) FROM my_subscriptions WHERE topic_name = $1 LIMIT 1', [topic]);

    if (subscriptionEntryAlreadyExisting.length > 0 && subscriptionEntryAlreadyExisting[0].status !== 'failed') {
      // Reject request if subscription exist and the status isn't failed
      return res.status(409).json({
        success: false,
        message: 'Subscription already exist',
      });
    } else {

      await db.none(
        'INSERT INTO my_subscriptions(topic_name, status) VALUES($1, $2) ON CONFLICT (topic_name) DO UPDATE SET status = ($2)',
        [topic, 'pending']
      );
    }


    // check to see if topic is supported by the publisher
    const topicResult = await db.any('SELECT id, name FROM topics WHERE name = $1', [topic]);

    if (topicResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Topic does not exist',
      });
    }

    const topicResultId = topicResult[0].id;
    await addJobToVerifySubscriberIntent({callbackUrl: urlWithoutParams, mode, topic, topicId: topicResultId});

    return res.status(202).json({
      success: true,
      message: 'Subscription request received and is now been verified'
    });

  }
  catch(e) {
    return res.status(500).json({
      success: 'error',
      message: e.message,
      e,
    });
  }

}


