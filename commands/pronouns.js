exports.run = async (client, message, args) => {

if(!args || args.length < 1) {
  return message.reply("This is the pronoun command! This is how to use it :) ");
}

switch(args[0]) {
  case 'add':
  //add a pronoun role to yourself.
  break;

  case 'remove':
  //remove a pronoun role from yourself.
  break;

  case 'request':
  //request a prounoun that isn't in the system yet.
  break;

  case 'approve':
  //approve a requested pronoun
  break;

  case 'approveall':
  //
  break;

  case 'deny':
  //
  break;

  default:
  //display help screen if nothing works
  break;
  }
};

function displayHelp () {
  let finalHelp;
  return finalHelp;
}

function hasPerms () {

}
