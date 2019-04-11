module.exports = async (client, reaction, user) => {
  const message = reaction.message;
  return message.channel.send("well, i saw it get removed.  what else do you want");
};
