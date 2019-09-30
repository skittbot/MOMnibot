exports.run = (client, message, args) => {
  const names = client.badgeList.indexes;
  //const urls = Array.from(client.bgList.values());
  console.log(names);
  if (names.length < 1) return message.channel.send("There are currently no badges loaded into the database.");
  var eachBadge = [];
  for(var key of names) {
    if(!(key === 'master list')) eachBadge.push({"name": key,"value":`[${client.badgeList.get(key,"description")}](${client.badgeList.get(key,"url")})`});
  }
  console.log(eachBadge);
  return message.channel.send('Here are a list of badges for this bot. To view what you have earned, use the following command: \n!profile',{
  "embed": {
    "color": 8317360,
    "fields": eachBadge
    }
  });
}
