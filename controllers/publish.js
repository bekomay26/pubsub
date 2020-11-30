const {addJobForEachSubscriber} = require('../task');

// route /publish POST

exports.publish = async (req, res) => {
  // recieve update
  const { topic } = req.params;
  const updateBody = req.body;

  // inform hub of new update to topic
  addJobForEachSubscriber(topic, updateBody);
  // await addJobForEachSubscriber(topic, message)
  return res.status(200).json({
    success: true,
    message: 'Message published'
  });
}