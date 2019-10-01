exports.run = (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_ROLES')) return;
  if(!args || args.length < 2) return message.channel.send('The syntax for this command is: !lockbg [_bg name_] [_role_]');

  var bgExist = client.bgList.has(args[0]);
  if (!bgExist) return message.channel.send('No such background could be found.');
  
  var roleName = message.guild.roles.find(role => role.name === args[1]);
  if (args[1] === 'unlock') {
	  client.bgList.delete(args[0],"lock");
	  return message.channel.send('You have unlocked this background.');
  }
  if (!roleName) return message.channel.send('No role could be found to lock this background to.');
  
  client.bgList.set(args[0],args[1],"lock");
  return message.channel.send('Your background, titled ' + args[0] + ' has been locked to the set role.');
}