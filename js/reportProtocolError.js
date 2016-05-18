/**
 * @param {string} error
 * @param {!Object} messageObject
 */
function reportProtocolError(error, messageObject)
{
    console.error(error + ": " + JSON.stringify(messageObject));
}

module.exports = {
  reportProtocolError
};
