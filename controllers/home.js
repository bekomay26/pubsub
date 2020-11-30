const {db} = require('../database');

/**
 * Receive update
 * @name POST /
 * @param {object} req
 * @param {object} res
 * @returns {(json)}JSON object
 */
exports.receiveUpdate = async (req, res) => {
  const { update, topic } = req.body;
  try {
    await db.none(
      'INSERT INTO updates (topic_name, message) VALUES($1, $2)',
      [topic, update.message]
    );

    return res.status(200).json({
      message: 'Update received'
    });
  } catch (error) {
    return res.status(500).json({
      success: 'error',
      message: error.message
    });
  }
}


/**
 * Subscriber verifies subscription request
 * @name GET /
 * @param {object} req
 * @param {object} res
 * @returns {(json)}JSON object
 */
exports.subscriberVerification = async (req, res) => {
  try {
    const {mode, topic, challenge: requestChallenge} = req.query;

    const pendingSubscriptionExists =
      await db.any('SELECT exists (SELECT 1 FROM my_subscriptions WHERE topic_name = $1 AND status = $2 LIMIT 1)', [topic, 'pending']);

    if (pendingSubscriptionExists[0].exists) {
      return res.status(202).json({
        challenge: requestChallenge
      });
    } else {
      return res.status(404).json({success: false});
    }


  }
  catch(e) {
    return res.status(500).json({
      success: 'error',
      message: e.message,
    });
  }


}

/**
 * Gets notified on the verification status
 * @name POST /verified
 * @param {object} req
 * @param {object} res
 * @returns {(json)}JSON object
 */
exports.subscriptionVerified = async (req, res) => {
  try {
    const {status, topic} = req.body;

    const subscription_status = status === 'ACCEPTED' ? 'success' : 'failed';

    await db.none(
      'UPDATE my_subscriptions SET status = $1 WHERE topic_name = $2', [subscription_status, topic]
    );

    return res.status(200).json({success: true});;

  }
  catch(e) {
    return res.status(500).json({
      success: 'error',
      message: e.message,
    });
  }


}


/**
 * Get all updates received
 * @name GET /event
 * @param {object} req
 * @param {object} res
 * @returns {(json)}JSON object
 */
exports.getEvents = async (req, res) => {
  try {

    const allUpdates = await db.any('SELECT * FROM updates');

    return res.status(200).json({
      message: 'All updates retrieved',
      updates: allUpdates
    });

  }
  catch(e) {
    return res.status(500).json({
      success: 'error',
      message: e.message,
    });
  }


}