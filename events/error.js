module.exports = async (client, e) => {
  console.error(e);
  if (client.config.settings.debug) {
    client.fetchUser(client.config.ownerID)
      .then(result => result.createDM())
      .then(newResult => newResult.send(e))
      .catch(wasError => {
        return console.log("Failed to send message: " + wasError);
    });
  }
};
