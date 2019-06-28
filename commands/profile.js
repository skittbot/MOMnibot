const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const { Attachment } = require("discord.js"); // This is to send the image via discord.
const fetch = require("node-fetch"); // This is to fetch the user avatar and convert it to a buffer.
const fsn = require('fs-nextra');
const { createCanvas, loadImage } = require('canvas');
//Canvas.registerFont(resolve(join(__dirname, "./path/to/font/Discord.ttf")), "Discord");

const imageUrlRegex = /\?size=2048$/g;

async function profile(member, info, bSash) {
  // We only need the level, and points values, we don't need the user or guild id.
  const { team, badges, profColor } = info;
  // We're grabbing the body out of snekfetch's get method, but at the same time we're assigning a variable
  // to it, avatar.
  // Remember when I mentioned the regex before? Now we get to use it, we want to set the size to 128 pixels,
  // instead of 2048 pixels.
  const name = member.displayName.length > 20 ? member.displayName.substring(0, 17) + "..." : member.displayName;
  const result = await fetch(member.user.displayAvatarURL.replace(imageUrlRegex, "?size=128"));
  //if (!result.ok) throw new Error("Failed to get the avatar.");
  const avatar = await result.buffer();
  //if (!avatar.ok) throw new Error("failed to save the avatar as a buffer");



  const testbadge = await fetch(`http://catputer.com/marm/miitopia-badge-equipment-master.png`);
  const testbadgebuf = await testbadge.buffer();


  var profilePic = new Canvas(400, 180)
    // Create the Blurple rectangle on the right side of the image.
    .setColor(profColor)
    .addRect(84, 0, 316, 180)
    // Create the "Dark, but not black" boxes for the left side of the image
    // and the text boxes on the right.
    .setColor("#2C2F33")
    .addRect(0, 0, 84, 180)
    .addRect(169, 26, 231, 46)
    .addRect(169, 80, 231, 74)
    // Create a shadow effect for the avatar placement.
    .setShadowColor("rgba(22, 22, 22, 1)") // This is a nice colour for a shadow.
    .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
    .setShadowBlur(10) // Blur the shadow by 10.
    // This circle is 2 pixels smaller in the radius to prevent a pixel border.
    .addCircle(84, 90, 62)
    .addCircularImage(avatar, 84, 90, 64)
    // This creates a rounded corner rectangle, you must use save and restore to
    // clear the clip after we are done with it
    .save()
    .createBeveledClip(20, 138, 128, 32, 5)
    .setColor("#23272A")
    .fill()
    .restore()
    // Add all of the text for the template.
    // Let's center the text
    .setTextAlign("center")
    // I'm using a custom font, which I will show you how to add next.
    .setTextFont("10pt Discord")
    // Set the colour to white, since we have a dark background for all the text boxes.
    .setColor("#FFFFFF")
    // Add the name variable.
    .addText(team, 285, 54)
    // Using template literals, you can add text and variables, we're applying the toLocaleString()
    // to break up the number into a nice readable format.
    .addText(name, 84, 159);
    var n = 0;
    for await (const stre of bSash) {
      await profilePic.addImage(stre, 173+n*40, 84, 40, 40);
      console.log(`displayed a badge at ${173+n*40}`);
      n++;
    }
    // profilePic.addImage(bSash[0], 173, 84, 40, 40);
    // profilePic.addRect(173, 84, 40, 40);

    /*await bSash.forEach(async function(i,n) {

      return await profilePic.addImage(i, 173, 84, 40, 40);
    });*/
    return await profilePic.toBuffer();
    // Let's add all the points!




    //profilePic
    //return profilePic.toBuffer();
}

async function gatherBadges(client,sash) {
  var badgeStream = [];
  var badgeGet;
  var badgeResult;
  for await (const x of sash){
    badgeGet = await fetch(client.badgeList.get(x,"url"));
    badgeResult = await badgeGet.buffer();
    await badgeStream.push(badgeResult);
    console.log(`found badge: ${x}`);
  }


/*
  await sash.forEach(async function(x){
    if (client.badgeList.has(x)) {
      badgeGet = await fetch(client.badgeList.get(x,"url"));
      badgeResult = await badgeGet.buffer();
      await badgeStream.push(badgeResult);
      console.log(`found badge: ${x}`);
    }
  });*/
  return badgeStream;
};

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
  // This will check to see if the command was ran in a guild instead of a DM.
  if (message.guild) {
    // This creates a "key" for enmaps Key/Value system.
    // We've declared it as a variable as we'll be using it in multiple places.
    const key = message.author.username;
    // If the points database does not have the message author in the database...
    if (!client.userProfiles.has(key)) {
      // Create an entry for them...
      /*client.userProfiles.set(key, {
        // Using the predefined information below.
        user: message.author.id, guild: message.guild.id, points: 0, level: 1
      });*/
    client.userProfiles.set(key,{"team":"none","badges":[],"profColor":"#7289DA"});
    }
    if (!client.userProfiles.has(key,"profColor")) client.userProfiles.set(key,"#7289DA","profColor");
    // We await both the message.channel.send, and the profile function.
    // Also remember, we wanted to pass the member object, and the points object.
    // Since we're creating a user profile, we should give it a unique file name.
    const badgeSash = await gatherBadges(client,client.userProfiles.get(key,"badges"));
    const buffer = await profile(message.member, client.userProfiles.get(key),badgeSash);
    const filename = `profile-${message.author.id}.jpg`;
    const attachment = new Attachment(buffer, filename);
    await message.channel.send(attachment);
  }
};

/*exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "profile",
  category: "economy",
  description: "Display user profile.",
  usage: "profile"
};*/
