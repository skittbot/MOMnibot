exports.run = (client, message, args) => {
    if(!message.member.hasPermission('MANAGE_ROLES')) return console.log('{$message.member} attempted to use the badge command.');
    if(!args || args.length < 1) {
      return message.channel.send('This command adds, and removes badges from the badge list, and can also be used to pull up a badge\'s description.');
    }
    const subCommand = args.shift().toLowerCase();
    /*if (args.length > 2) {
      const desc = args.slice(2).join(" ");
    }*/

    switch(subCommand) {

      case 'add':
        if (args.length < 3) return message.channel.send("the syntax for this command is: !badge add [_badge name_] [_badge image url_] [_badge description]");
        const desc = args.slice(2).join(" ");
        console.log(`adding badge: ${args[0]} ${args[1]} ${desc}`);
        var bName = initialCaps(args[0]);
        var bURL = args[1];
        try {
          client.badgeList.set(bName,{ url:bURL , description: desc });
          client.badgeList.push("master list", bName);
          message.channel.send('badge added!');
          console.log(`badge successfully added`);
        } catch(e) {
          console.log('there was an issue adding a badge:');
          return console.log(e);
        }
      break;

      case 'del':
        if (args.length !== 1) return message.channel.send("the syntax for this command is !badge del [_badge name_]");
        var bName = initialCaps(args[0]);
        console.log(`deleting badge: ${bName}`);
        try {
          client.badgeList.delete(bName);
          client.badgeList.remove("master list",bName);
          message.channel.send('badge deleted!');
          console.log('badge successfully deleted');
        } catch(e) {
          console.log('there was an issue deleting a badge');
          return console.log(e);
        }
      break;

      case 'disp':
        if (args.length !== 1) return message.channel.send("the syntax for this test command is !badge disp [_badge name_]");
        var bName = initialCaps(args[0]);
        console.log(`finding badge: ${bName}`);
        try {
          var dispBadge = client.badgeList.get(bName);
          message.channel.send(`badge name: ${bName} url: ${dispBadge.url} description: ${dispBadge.description}`);
          console.log('badge successfully displayed');
        } catch(e) {
          console.log('there was an error displaying a badge');
          return console.log(e);
        }
      break;
      
      case 'give':
        if (args.length < 2) return message.channel.send("the syntax for this command is !badge give [_badge name_] [_user mentions_]");
        var bName = initialCaps(args[0]);
        var checkList = client.badgeList.get("master list");
        if (!checkList.includes(bName)) return message.channel.send("this badge does not exist");

        var bRecips = message.mentions.users;

        console.log(bRecips.size);
        var bUsers = [];
        if (bRecips.size === 0) return message.channel.send("please mention the users who will be recieving the badges");
        var currUser;
        /*for(var key in bRecips) {
          try {
            currUser = bRecips[key].username;
            bUsers.push(currUser);
            console.log(currUser);
          } catch (e) {
            console.log(`error with detecting user #${key}`);
            console.log(e);
          }
        }*/

        bRecips.forEach(function(x){
          try {
            console.log(x.username);
            bUsers.push(x.username);
          } catch(e) {
            console.log(e);
          }
        });


        console.log(bUsers);
        if (bUsers === []) return message.channel.send("please mention the users who will be recieving the badges");
        for(var person in bUsers) {
          try {
            client.userProfiles.ensure(bUsers[person],{"team":"none","badges":[],"profColor":"#7289DA"});
            client.userProfiles.ensure(bUsers[person],[],"badges");
            if (client.userProfiles.get(bUsers[person],"badges").includes(bName)) console.log("duplicate badge detected");
            client.userProfiles.push(bUsers[person],bName,"badges");
            // note: don't let it actually do this.  combine it all into one message
            message.channel.send(`added a badge ${bName} to user ${bUsers[person]}`);
          } catch(e) {
            console.log(`error with adding badge to user #${person}`);
            console.log(e);
          }
        }
      break;

      case 'dispuser':
        let anyTarget = message.mentions.users.first();
        try {
          if (!anyTarget) anyTarget = message.author;
          var displayedUser = anyTarget.username;
          var userP = client.userProfiles.ensure(displayedUser,{"team":"none","badges":[],"profColor":"#7289DA"});
          console.log(userP.badges);
          message.channel.send(`user: ${displayedUser} | their badges: ${userP.badges}`,{files:["http://catputer.com/marm/miitopia-badge-equipment-master.png","http://catputer.com/cat.jpg"]});
        } catch(e) {
          console.log("there was an error fetching the user");
          console.log(e);
        }
      break;
    }

}

/*
function initialCaps(string) {
  let end = string.slice(1);
  return string.charAt(0).toUpperCase()+end.toLowerCase();
}
*/

function initialCaps(str) {
  str = str.split("_");
  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}
