module.exports = (client, oldMember, newMember) => {
  if (newMember.roles === oldMember.roles) return console.log('no role change this time');
  var currentTeams = client.teamList.keyArray();
  //console.log(`${oldMember.roles.array()} compared to ${newMember.roles.array()}`);
  for(var i = 0;i<currentTeams.length;i++) {
    if (newMember.roles.find(role => role.name === currentTeams[i])) {
      if (!oldMember.roles.find(role => role.name === currentTeams[i])) {
        //set default user if they don't exist
        var key = newMember.user.username;
        //set the key so it pulls up easier
        if (!client.userProfiles.has(key)) {
          client.userProfiles.set(key,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"https://i.imgur.com/7okSCgl.png"});
        }
        client.userProfiles.push(key,currentTeams[i],"badges");
        var postTo = newMember.guild.channels.find(channel => channel.name === 'bot-spam');
        client.teamList.inc(currentTeams[i],"count");

        const thisBadge = client.badgeList.get(currentTeams[i]);

        postTo.send({
          "embed": {
            "title": `${key} has joined a team and earned a badge!`,
            "description": '**' + currentTeams[i] +'**\n' + thisBadge.description,
            "color": 12235237,
            "footer": {
              "text": "badge created by: "+ thisBadge.creator
            },
            "thumbnail": {
            "url": thisBadge.url
            }
          }
        });

        //postTo.send('ok should have added the badge i guess');
      }
    }
  }
};
