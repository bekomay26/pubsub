const {addJobForEachSubscriber} = require('../task');

exports.publish = async (req, res) => {
  const { topic } = req.params;
  const updateBody = req.body;

  // inform hub of new update to topic
  addJobForEachSubscriber(topic, updateBody);

  return res.status(200).json({
    success: true,
    message: 'Message published'
  });
}