exports.run = (client, message, args) => {
  if (args.length < 2) return message.channel.send("ok yeah here's a spot for stuff");
  const subCommand = args.shift().toLowerCase();
  const theEdit = args.join(" ");
  //const desc = args.slice(2).join(" ");

  switch(subCommand) {

    case "color":
      if (theEdit.length !== 6) return message.channel.send("To set your profile color, you need a 6 digit color hex code. You do not need to supply a #.")
      var finalEdit = "#"+theEdit;
      client.userProfiles.ensure(message.author.username,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"http://catputer.com/imgs/blankcard.png"});
      client.userProfiles.set(message.author.username,finalEdit,"profColor");
      return message.channel.send("You have successfully set your profile color.");
    break;

    case "team":
      var finalEdit = theEdit.replace(/[^a-z0-9]/gi, ' ');
      finalEdit = initialCaps(finalEdit);
      client.userProfiles.ensure(message.author.username,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"http://catputer.com/imgs/blankcard.png"});
      client.userProfiles.set(message.author.username,finalEdit,"team");
      return message.channel.send(`You have joined the team: ${finalEdit}.`);
    break;

    case "bg":
      if (!client.bgList.has(theEdit)) return message.channel.send("The specified background does not exist. For a full list of backgrounds to choose from, try using the !prlist command.");
      client.userProfiles.ensure(message.author.username,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"http://catputer.com/imgs/blankcard.png"});
      client.userProfiles.set(message.author.username,client.bgList.get(theEdit),"profBGI");
      return message.channel.send('You have successfully changed your profile background image.');
    break;

    case "nobg":
      client.userProfiles.ensure(message.author.username,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"http://catputer.com/imgs/blankcard.png"});
      client.userProfiles.set(message.author.username,"http://catputer.com/imgs/blankcard.png","profBGI");
      return message.channel.send('Your background image has been removed.');
    break;


  }
}

function initialCaps(str) {
  str = str.split(" ");
  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}
