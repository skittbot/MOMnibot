exports.run = (client, message) => {
  if(!message.member.hasPermission('MANAGE_MESSAGES')) {
    client.settings.ensure(message.guild.id, { starboard: false});
    client.settings.set(message.guild.id,message.channel,"starboard");
  }
};
