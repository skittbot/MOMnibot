exports.run = (client,message,args) => {
	if(!message.member.hasPermission('MANAGE_ROLES')) return console.log('{$message.member} tried to un-approve a link.');
	if(!args || args.length != 1) return message.channel.send(`The command for un-approving an invite link is ${client.config.settings.prefix}unapprove [*invite link*]`);
	try {
		let listApproved = client.approvedLinks.ensure(message.guild.id,[]);
		client.approvedLinks.remove(message.guild.id, args[0]);
		message.channel.send(`You have successfully removed an approved invite link: \`${args[0]}\` `);
		console.log(listApproved);
	} catch {
		console.log('There was an issue retrieving the approved link.');
	}
	return;
};
