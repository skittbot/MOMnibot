exports.run = (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_ROLES')) return;
  if(!args || args.length < 1) return message.channel.send('The syntax for this command is: !rmbg [_bg name_]');
  client.bgList.delete(args[0]);
  return message.channel.send('Your background, titled ' + args[0] + ' has been removed from the database');
}
