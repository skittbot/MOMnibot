module.exports = async (client, reaction, user) => {
  const message = reaction.message;
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
  if (message.author.bot) return;
  const gEmoji = await client.galleryEmote.ensure(message.guild.id,{"galleryEmoji":""});
  if (!gEmoji) return;
  if (reaction.emoji.name !== gEmoji.name) return console.log(gEmoji);
  // message.channel.send("well, i saw it.  what else do you want. this was posted in: " + message.channel);
  const artboardChannel = client.config.settings.artboardName;
  const artboard = await message.guild.channels.find(channel => channel.name === artboardChannel);
  if (!artboard) return message.channel.send(`It doesn't look like this server has a channel called ${artboardChannel}.`);
  const anyEmbeds = await message.embeds[0];
  //put embed code here:
  var image = message.attachments.size > 0 ? await extension(reaction, message.attachments.array()[0].url,message) : '';
  var extraImages = [];
  var extraImage = '';
  if (message.attachments.size > 1) {
    for(let i = 1; i < message.attachments.size; i++) {
      extraImage = await extension(reaction, message.attachments.array()[i].url,message);
      if (!(extraImage === '')) await extraImages.push(extraImage);
    }
  }
  if (anyEmbeds) {
    if ((image==='') && anyEmbeds.type === "image") image = anyEmbeds.url;
  }
  const embed = await { embed: {
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
  }};
  await artboard.send(embed);

  //debug
  //console.log(extraImages);
  //console.log(extraImages.length);

  if (extraImages.length > 0) {
      var i = 0;
      while(i < extraImages.length) {
          var moreEmbed = await embed;
        moreEmbed.embed.image.url = await extraImages[i];
        moreEmbed.embed.description = await message.cleanContent.concat(` (page ${i+2})`);
      await artboard.send(moreEmbed);
      i++;
    }
    //}
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

async function addMoreEmbeds(item, i, message) {



};
