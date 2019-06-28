exports.run = (client, message, args) => {
  if (args.length !== 2) return;
  const subCommand = args.shift().toLowerCase();
  const theEdit = args.shift();

  switch(subCommand) {

    case "color":
      if (theEdit.length !== 6) return message.channel.send("To set your profile color, you need a 6 digit color hex code. You do not need to supply a #.")
      var finalEdit = "#"+theEdit;
      client.userProfiles.ensure(message.author.username,{"team":"none","badges":[],"profColor":"#7289DA"});
      client.userProfiles.set(message.author.username,finalEdit,"profColor");
      return message.channel.send("You have successfully set your profile color.");
    break;

    case "team":
      return message.channel.send("teams are not selectable at this time.");
    break;
  }
}
