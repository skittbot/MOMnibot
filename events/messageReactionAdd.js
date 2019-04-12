module.exports = async (client, reaction, user) => {
  const message = reaction.message;
  message.channel.send("well, i saw it.  what else do you want. this was posted in: " + message.channel);
  const artboardChannel = "artboard";
  const artboard = await message.guild.channels.find(channel => channel.name === artboardChannel);
  if (!artboard) return message.channel.send("whoops you done goofed it");
  const anyEmbeds = await message.embeds[0];
  //put embed code here:
  var image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url,message) : '';
  var extraImages = [];
  if (message.attachments.size > 1) {
    for(let i = 1; i < message.attachments.size; i++) {
      let extraImage = await extension(reaction, message.attachments.array()[i].url,message) : '';
      if (!(extraimage === '')) extraImages.push(extraImages);
    }
  }
  if (anyEmbeds) {
    if ((image==='') && anyEmbeds.type === "image") image = anyEmbeds.url;
  }
  const embed = await {
    "description": message.cleanContent,
    "url": message.url,
    "color": 11103793,
    "timestamp": new Date(),
    "footer": {
      "icon_url": message.author.displayAvatarURL,
      "text": message.author.tag
    },
    "image": {
      "url": image
    },
    "author": {
      "name": `Amazing artwork by ${message.author.username} | (${message.author.tag})!`,
      "icon_url": message.author.displayAvatarURL
    },
    "fields": []
  };
  artboard.send({ embed });
  if (extraImages.size > 0) {
    var moreEmbed = embed;
    for(let i = 0, i < extraImages, i++) {
      moreEmbed.image.url = extraImages[i];
      artboard.send({ moreEmbed});
    }
  }

  return;
};

async function extension(reaction, attachment,message) {
  const imageLink = attachment.split('.');
  const typeOfImage = imageLink[imageLink.length - 1];
  const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
  if (!image) return '';
  return attachment;
};

async function addLinkedEmbeds(message) {


};
