exports.run = (client,message,args) => {
	if(!message.member.hasPermission('MANAGE_ROLES')) return console.log('{$message.member} tried to approve a new link.');
	if(!args || args.length != 1) return message.channel.send(`The command for approving a new invite link is ${client.config.settings.prefix}approve [*invite link*]`);
	try {
		let listApproved = client.approvedLinks.ensure(message.guild.id,[]);
		client.approvedLinks.push(message.guild.id, args[0]);
		message.channel.send(`You have successfully added an approved invite link: \`${args[0]}\` `);
		console.log(listApproved);
	} catch {
		console.log('There was an issue retrieving the approved link.');
	}
	return;
};
