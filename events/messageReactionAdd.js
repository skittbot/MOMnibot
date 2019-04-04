module.exports = class {
  constructor(client) {
    this.client = client;
  }

  // This is where all the action happens.
  async run(reaction, user) {
    const message = reaction.message;
     // This is the first check where we check to see if the reaction is not the unicode star emote.
    if (reaction.emoji.name !== '⭐') return;
     // Here we check to see if the person who reacted is the person who sent the original message.

     // This line needs to be replaced. Mods may want to promote their own work.
    if (message.author.id === user.id) return message.channel.send(`${user}, you cannot star your own messages.`);
    // This is our final check, checking to see if message was sent by a bot.
    if (message.author.bot) return message.channel.send(`${user}, you cannot star bot messages.`);
    // Here we get the starboard channel from the guilds settings.

    // This line needs to be replaced, as we're not using Guidebot settings and instead just a simple json permissions file.
    const { starboardChannel } = this.client.settings.get(message.guild.id);
    // Here we will find the channel

    //This line may need to change. I'm not sure yet.
    const starChannel = message.guild.channels.find(channel => channel.name == starboardChannel)
    // If there's no starboard channel, we stop the event from running any further, and tell them that they don't have a starboard channel.
    if (!starChannel) return message.channel.send(`It appears that you do not have a \`${starboardChannel}\` channel.`);

    // Here we fetch 100 messages from the starboard channel.
    const fetch = await starChannel.fetchMessages({ limit: 100 });
    // We check the messages within the fetch object to see if the message that was reacted to is already a message in the starboard,
    const stars = fetch.find(m => m.embeds[0].footer.text.startsWith('⭐') && m.embeds[0].footer.text.endsWith(message.id));
    // Now we setup an if statement for if the message is found within the starboard.
    if (stars) {
      // Regex to check how many stars the embed has.
      const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      // A variable that allows us to use the color of the pre-existing embed.
      const foundStar = stars.embeds[0];
      // We use the this.extension function to see if there is anything attached to the message.
      const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
      const embed = new RichEmbed()
        .setColor(foundStar.color)
        .setDescription(foundStar.description)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${message.id}`)
        .setImage(image);
      // We fetch the ID of the message already on the starboard.
      const starMsg = await starChannel.fetchMessage(stars.id);
      // And now we edit the message with the new embed!
      await starMsg.edit({ embed });
    }

    // Now we use an if statement for if a message isn't found in the starboard for the message.
    if (!stars) {
      // We use the this.extension function to see if there is anything attached to the message.
      const image = message.attachments.size > 0 ? await this.extension(reaction, message.attachments.array()[0].url) : '';
      // If the message is empty, we don't allow the user to star the message.
      if (image === '' && message.cleanContent.length < 1) return message.channel.send(`${user}, you cannot star an empty message.`);
      const embed = new RichEmbed()
        // We set the color to a nice yellow here.
        .setColor(15844367)
        // Here we use cleanContent, which replaces all mentions in the message with their
        // equivalent text. For example, an @everyone ping will just display as @everyone, without tagging you!
        // At the date of this edit (09/06/18) embeds do not mention yet.
        // But nothing is stopping Discord from enabling mentions from embeds in a future update.
        .setDescription(message.cleanContent)
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp(new Date())
        .setFooter(`⭐ 1 | ${message.id}`)
        .setImage(image);
      await starChannel.send({ embed });
    }

}
