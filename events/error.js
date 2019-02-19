module.exports = (client, e) => {
  console.error(e);
  client.fetchUser(client.config.ownerID)
  .then(result => result.createDM())
  .then(newResult => newResult.send(e))
  .catch(wasError => {
      return console.log("Failed to send message: " + wasError);
  });

};
