exports.run = (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_ROLES')) return;
  if(!args || args.length < 2) return message.channel.send('The syntax for this command is: !addbg [_bg name_] [_url_]');
  client.bgList.set(args[0],{'url':args[1]});
  return message.channel.send('Your background, titled ' + args[0] + ' has been added to the database');
}
