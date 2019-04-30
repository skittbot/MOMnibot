exports.run = (client, message, args) => {
  if(!message.member.hasPermission('MANAGE_CHANNELS')) return console.log('{$message.member} tried to mute someone.');
  if(!args || args.length < 1) return message.channel.send("the command for muting someone is !mute username hours");
    return client.setTimeout(message.channel.send("haha hehe hoohoo i waited 10 seconds!"),10000);
};
