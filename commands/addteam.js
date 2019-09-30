exports.run = (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_ROLES')) return;
  if(!args || args.length < 1) return message.channel.send('The syntax for this command is: !addteam [_teamname_]');
  var subTeam = args.join("_").toLowerCase();
  subTeam = initialCaps(subTeam);
  var roleName = message.guild.roles.find(role => role.name === subTeam);
  var badgeExists = client.badgeList.has(subTeam);
  if (!roleName) return message.channel.send('The role has not been created yet.');
  if (!badgeExists) return message.channel.send('The badge has not been added yet.');
  client.teamList.set(subTeam,{'name':subTeam,'count':0}));
  return message.channel.send(`Team created: ${client.teamList.get(subTeam,'name')} with ${client.teamList.get(subteam,'count')} users.`);


};


function initialCaps(str) {
  str = str.split("_");
  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}
