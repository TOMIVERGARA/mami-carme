//Loads DotEnv Files
const { config } = require('dotenv');
config();

//Loads config.json
const { user_settings } = require('../config.json')

//Imports Discord client
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Imports FileSystem to read config file
const fs = require('fs');
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

console.log(`Found ${commandFiles.length} ${commandFiles.length == 1 ? 'command' : 'commands'}.`)
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
   console.log(`➥ ${file}`)
}

client.once('ready', () => {
	console.log(`Client Ready! - @${client.user.id}`);
});

client.on('message', message => {
   if (!message.content.startsWith(`<@!${client.user.id}>`) || message.author.bot) return;
   console.log(`Message Recived: ${message}`)

	const args = message.content.slice(`<@&${client.user.id}>`.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    try {
	    command.execute(message, args);
    } catch (error) {
	    console.error(error);
	    message.reply('Perdone mijo, tuve un problema para ejecutar ese comando!');
    }
});

//Logs In to bot account
client.login(process.env.DISCORD_BOT_TOKEN)
   .catch((error) => {
      console.log("There was an error during login: " + error)
   })
