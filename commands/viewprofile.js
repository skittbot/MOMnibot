const { Canvas } = require("canvas-constructor"); // You can't make images without this.
const { resolve, join } = require("path"); // This is to get a font file.
const { Attachment } = require("discord.js"); // This is to send the image via discord.
const fetch = require("node-fetch"); // This is to fetch the user avatar and convert it to a buffer.
const fsn = require('fs-nextra');
const { createCanvas, loadImage } = require('canvas');
Canvas.registerFont(resolve(join(__dirname, "../fonts/Whitney.ttf")), "Discord");

const imageUrlRegex = /\?size=2048$/g;

async function profile(member, info, bSash, tPage, tBadges) {
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


//  var hasBGI = false;
  var bGIURL = info.profBGI;
  console.log(bGIURL);
  //if (!(bGIURL === "")) {
//    hasBGI = true;
    const bGI = await fetch(bGIURL);
    //if (!bGI.ok) throw new Error("Failed to fetch the background image.");
    const bGIbuf = await bGI.buffer();
    //if (!bGIbuf.ok) throw new Error("Failed to buffer the background image.");
//  }


  var profilePic = new Canvas(420, 300)
    // Create the Blurple rectangle on the right side of the image.
    .setColor(profColor)
    .addRect(0, 0, 420, 300)
    .addImage(bGIbuf,0,0,420,300)
    // Create the "Dark, but not black" boxes for the left side of the image
    // and the text boxes on the right.
    .setColor("#2C2F33")
    //.addRect(0, 0, 84, 300)
    //.addRect(169, 10, 223, 26)
    .addRect(160, 50, 240, 240)
    .addRect(20, 160, 128, 36)
    // Create a shadow effect for the avatar placement.
    // .setShadowColor("rgba(22, 22, 22, 1)") // This is a nice colour for a shadow.
    // .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
    // .setShadowBlur(10) // Blur the shadow by 10.
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
    //.addText(`Team ${team}`, 285, 28)
    // Using template literals, you can add text and variables, we're applying the toLocaleString()
    // to break up the number into a nice readable format.
    .addText(name, 84, 159)
    .addText(`Total Badges: ${tBadges}`, 84 , 188)
    .addText(tPage, 410, 295);
    var n = 0;
    var w = 0;
    var done = false;

    for await (const stre of bSash) {
      if (!done) await profilePic.addImage(stre, 160+n*40, 54+w*40, 40, 40);
      console.log(`displayed a badge at ${160+n*40}x${54+w*40}`);
      n++;
      if (n >= 6) {
        n = 0;
        w++;
        if (w >= 6) done = true;
      }
    }
    return await profilePic.toBuffer();
}

async function gatherBadges(client,fullSash, bPage) {
  var badgeStream = [];
  var badgeGet;
  var badgeResult;
  if (bPage*36 < fullSash.length) bPage = 0;
  var sash = fullSash.slice(bPage*36);
  for await (const x of sash){
    badgeGet = await fetch(client.badgeList.get(x,"url"));
    badgeResult = await badgeGet.buffer();
    await badgeStream.push(badgeResult);
    console.log(`found badge: ${x}`);
  }
  return badgeStream;
};

// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, args) => {
  // This will check to see if the command was ran in a guild instead of a DM.
  if (message.guild) {

    if(!message.member.hasPermission('MANAGE_ROLES')) return console.log('{$message.member} does not have permission to view other badges');
    if(!args || args.length != 1) return message.channel.send(`The command for viewing a user profile is ${client.config.settings.prefix}viewprofile [*@username*] [*hours*]`);

    // This creates a "key" for enmaps Key/Value system.
    // We've declared it as a variable as we'll be using it in multiple places.
    try {
      const keyMem = message.mentions.members.first();
      const keyUser = message.mentions.users.first();
      const key = message.mentions.users.first().username;
      if (!key) return message.channel.send("The specified user could not be found.");
    } catch(e) {
      return message.channel.send("The specified user could not be found or there was another error.");
    }



    // If the points database does not have the message author in the database...
    if (!client.userProfiles.has(key)) {
      // Create an entry for them...
      /*client.userProfiles.set(key, {
        // Using the predefined information below.
        user: message.author.id, guild: message.guild.id, points: 0, level: 1
      });*/
    client.userProfiles.set(key,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"https://i.imgur.com/7okSCgl.png"});
  } else {

    //this code is to check if the user has any removed badges, and remove them from their profile.
    var checkListP = client.userProfiles.get(key,"badges");
    var checkListM = client.badgeList.get("master list");
    for await (const checkName of checkListP){
      if (!checkListM.includes(checkName)) await client.userProfiles.remove(key, checkName, "badges");
    }
  }
    var page = 1;
    if (!(args || args.length < 2)) {
      if (typeof args[1] == 'number') page = args[1];
      if (page < 1) page = 1;
    }
    page--;
    if (!client.userProfiles.has(key,"profColor")) client.userProfiles.set(key,"#7289DA","profColor");
    if (!client.userProfiles.has(key,"profBGI")) client.userProfiles.set(key,"https://i.imgur.com/7okSCgl.png","profBGI");
    // We await both the message.channel.send, and the profile function.
    // Also remember, we wanted to pass the member object, and the points object.
    // Since we're creating a user profile, we should give it a unique file name.
    const badgeSash = await gatherBadges(client,client.userProfiles.get(key,"badges"),page);
    page++;
    const buffer = await profile(keyMem, client.userProfiles.get(key),badgeSash,page,client.userProfiles.get(key,"badges").length);
    const filename = `profile-${keyUser.id}.jpg`;
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
