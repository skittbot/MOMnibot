exports.run = (client, message) => {
  client.emit("warn","oopsie poopsies");
  try{
    var o = null;
    console.log(o.length);
  }
  catch(err) {
    console.log(err);
    console.log("oh lol maybe it does work")
  }
};
