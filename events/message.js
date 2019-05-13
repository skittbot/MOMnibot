module.exports = (client, message) => {

  // Ignore all bots
  if (message.author.bot) return;
  if (message.guild) {
	  if(message.content.includes('discord.gg'||'discordapp.com/invite/') && !message.member.hasPermission('MANAGE_ROLES')) {
		var approvedInvites = client.approvedLinks.ensure(message.guild.id,[]);
		var approvedForPosting = false;
		//var constructingTwo = " ";
		//var constructing;
		for(i = 0; i < approvedInvites.length; i++) {
			//constructing = approvedInvites[i].concat(constructingTwo);
			approvedForPosting = message.content.includes(approvedInvites[i]);
		}
		  console.log(approvedInvites);
		  console.log(message.content);
		  if (!approvedForPosting) {
			  message.delete()
			  .then(msg => console.log(`Deleted unapproved link from ${msg.author.username}`))
			  .catch(console.error);
		  } else {
			  console.log(`Approved link is allowed: ${message.content}`);
		  }
	  }
  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(client.config.settings.prefix) !== 0) return;
  message.guild.fetchMember(message.author);
  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args);
  }
};
