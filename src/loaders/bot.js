//Imports Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Imports FileSystem to read config file
const fs = require('fs');

const { user_settings } = require('../../config.json');
const { deleteEmptyChannelAfterDelay } = require('../services/channels/voice-channels');

module.exports.startBot = () => {
    //Generates array with available commands
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    //Lists available commands in console and attaches to Discord.Collection
    console.log(`Found ${commandFiles.length} ${commandFiles.length == 1 ? 'command' : 'commands'}.`)
    for (const file of commandFiles) {
       const command = require(`../commands/${file}`);
       client.commands.set(command.name, command);
       console.log(`➥ ${file}`)
    }

    //Prints "Client Ready" Msg
    client.once('ready', () => {
        console.log(`Client Ready! - @${client.user.id}`);
    });

    //Starts Message collector
    client.on('message', message => {
       //Filters Msgs that contain prefix
       const prefixes = [`<@!${client.user.id}>`, `<@${client.user.id}>`];
       let prefix = false;
       for(const thisPrefix of prefixes) {
         if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
       }
       if(!prefix || message.author.bot) return;
       console.log(`Message Recived: ${message}`)

        //Extracts command name
        const args = message.content.slice(`<@&${client.user.id}>`.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        //Obtains command from Discord.Collection if exists - else returns
        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);

        //Executes command and catches errors
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Perdone mijo, tuve un problema para ejecutar ese comando!');
        }
    });

    client.on('voiceStateUpdate', oldState => {
        deleteEmptyChannelAfterDelay(oldState.channel)
    })

    //Logs In to Discord bot account and catches errors
    client.login(process.env.DISCORD_BOT_TOKEN)
       .catch((error) => {
          console.log("There was an error during login:");
          console.error(`➥ ${error}`);
          throw error
       })
}
