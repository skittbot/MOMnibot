exports.run = (client, message, args) => {
  if (!(message.author.id === client.config.ownerID)) return;
  if (!args || args.length < 1) return;
  if (!(args.length === 1)) return;
  const emojiFound = message.guild.emojis.find(emoji => emoji.name === args[0]);
  if (!emojiFound) return message.channel.send(`It doesn't look like ${args[0]} is an emoji on this server.`)
  client.galleryEmote.ensure(message.guild.id,{});
  client.galleryEmote.set(message.guild.id,args[0],"galleryEmoji");
  return message.channel.send(`You have set ${emojiFound} as the Gallery Emoji on this server.`);
};
