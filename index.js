const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");


client.on('ready', () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setPresence({
        game: {
            name: config.activity,
        }
    });


    //Map the players in the JSON to a dict  

    /*
    var players = {};
    for (var i = 0, pl; i < config.players.length; i++) {
        pl = config.players[i];
        players[ pl.id ] = pl;
    }
    */

    
 });

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);

});
  
client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);

});


client.on('message', message => {

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(message.author.bot) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();    

    console.log(config.prefix);

    var sayMessage = message.content;
    
    const defaultChannel = client.channels.find(channel => channel.name === config.channel);


    if(message.channel.type == "dm") {
        //what should happen on a Direct Message

        if(message.content.indexOf(config.prefix) == 0){

            if(command === "w"){


                var target;

                for (var i = 0; i < config.players.length; i++){

                    if (config.players[i].codeName == args[0]){
                        // we found it
                       // obj[i].name is the matched result
                       target = config.players[i]
                    }

                }

                if (target == null){
                    return message.reply(config.invalidPlayerMesssage);  
                }

                // Checks if the player is in the discord server
                let player = client.users.find(user => user.username == target.discordName );

                if(!player){

                    return message.reply(config.invalidDiscordMessage);  

                }
                else   {

                    // Remove the command in the message
                    args.shift();
                    sayMessage = args.join(" ");
                    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
                    message.delete().catch(O_o=>{}); 
                    // And we get the bot to say the thing: 
                    player.send(config.directMessageFlavourText + " " + sayMessage);

                }          


            }
            else{
                message.reply(config.invalidCommandMesssage);
            }


        }
        else {
            console.log(`ServerWide Message`);

            defaultChannel.send(config.globalMessageFlavourText + " " + sayMessage);   

        }         

    } else {

    //what should happen if the channel is not a dm

    console.log(`Normal Chat`);

    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 

    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete();        
            
    // And we get the bot to say the thing: 
    defaultChannel.send(config.globalMessageFlavourText + " " + sayMessage);   
    }     

 });

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret