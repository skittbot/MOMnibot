module.exports = (client, oldMember, newMember) => {
  if (newMember.roles === oldMember.roles) return console.log('no role change this time');
  var currentTeams = client.teamList.keyArray();
  console.log(`${oldMember.roles.array()} compared to ${newMember.roles.array()}`);
  for(var i = 0;i<currentTeams.length;i++) {
    if (newMember.roles.find(role => role.name === currentTeams[i])) {
      if (!oldMember.roles.find(role => role.name === currentTeams[i])) {
        //set default user if they don't exist
        var key = newMember.user.username;
        if (!client.userProfiles.has(key)) {
            // Create an entry for them...
            /*client.userProfiles.set(key, {
              // Using the predefined information below.
              user: message.author.id, guild: message.guild.id, points: 0, level: 1
            });*/
          client.userProfiles.set(key,{"team":"none","badges":[],"profColor":"#7289DA","profBGI":"http://catputer.com/imgs/blankcard.png"});
          client.userProfiles.push(key,currentTeams[i],"badges");
          var postTo = newMember.guild.channels.find(channel => channel.name === 'bot-spam');
          postTo.send('ok should have added the badge i guess');
        }


      }
    }
  }
};
