exports.run = (client, message, args) => {
  const names = client.bgList.indexes;
  //const urls = Array.from(client.bgList.values());
  console.log(names);
  if (names.length < 1) return message.channel.send("There are currently no backgrounds loaded into the database.");
  var eachBG = [];
  for(var key of names) {
    eachBG.push({"name": key,"value":`[click to preview](${client.bgList.get(key,'url')})`});
  }
  console.log(eachBG);
  return message.channel.send('Here are a list of backgrounds for your profile. To use one, use the following command: \n!predit bg *backgroundname*',{
  "embed": {
    "color": 8317360,
    "fields": eachBG
    }
  });
}
