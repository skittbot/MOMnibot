exports.run = async (client, message, args) => {
	if (!(message.author.id === client.config.ownerID)) return;
	if (!args || args.length < 2) return;
  const chan = args.shift();
	var msgy = await args.join(' ');
  	const prankboard = await message.guild.channels.find(channel => channel.name === chan);
  	if (!prankboard) return message.channel.send(`oops, cannot find the ${chan} channel.`);
  	return await prankboard.send(msgy);
};
