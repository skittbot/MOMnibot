exports.run = async (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_CHANNELS')) return console.log('{$message.member} tried to mute someone.');
  if(!args || args.length != 2) return message.channel.send(`The command for muting a user is ${client.config.settings.prefix}mute [*@username*] [*hours*]`);
  var mutedUser = await message.mentions.members.first();
  if (!mutedUser) return message.channel.send("The specified user could not be found.");
  const muteRole = await message.guild.roles.find(role => role.name === client.config.settings.muteRoleName);
  if (!muteRole) return message.channel.send("It doesn't look like you have a role for muted users yet.");
  //set time below--right now it's set to hours
  //it makes sure that the time is above nothing, and is actually a number too.  oh goodie
  var muteTime = parseInt(args[1],10);
  muteTime = muteTime * 1000 * 60 * 60;
  if (muteTime < 1) muteTime = 20000;
  var isMuted = await mutedUser.roles.has(muteRole.id);
  if (isMuted) return message.channel.send(`${mutedUser.displayName} has been muted.`);
  await mutedUser.addRole(muteRole).catch(console.error);
  message.channel.send(`${mutedUser.displayName} has been muted.`);
    client.setTimeout(function () {
      var isStillMuted = mutedUser.roles.has(muteRole.id);
      if(isStillMuted) {
        try {
          mutedUser.removeRole(muteRole).catch(console.error);
          message.channel.send(`${mutedUser.displayName} has been unmuted.`);
        } catch (e) {
          message.channel.send("There has been an error unmuting a user. Please contact your bot's owner.");
          console.error(e.toString());
        }
      }
    }, muteTime);
  return;
};
