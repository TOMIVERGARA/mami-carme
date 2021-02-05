//Imports Discord.js
const Discord = require('discord.js');
const { ReactionCollector } = require('discord.js-collector');
const { generateOtp } = require('../auth/otp');
const { user_settings } = require('../../config.json');

module.exports = {
	name: 'ayuda',
	description: 'Main Menu',
	async execute(message, args) {
        //Defines Message Author
        const user = message.author

        //Defines default embed styling
        const embeedSettings = {
            color: 15087942,
            author: {
              name: "Carmela aka. Mami Carme",
              url: "https://instagram.com/carmeintili?igshid=s3bczf05fdtt",
              icon_url: "https://cdn-virtual.miescueladigital.com.ar/prod/picture/profile-thumb/becac416-5d7c-48b3-b753-580a2290369c"
            },
            footer: {
              icon_url: `${user.displayAvatarURL({ dynamic: true })}`,
              text: `${user.username}`
            },
            timestamp: new Date()
        }

        //Defines Menu Pages(Structure)
        const pages = {
            '🙋': {
                embed: {
                    color: 15087942,
                    fields: [
                        {
                            name: 'En obra...',
                            value: `> Esta seccion se encuentra en construccion y todavia no esta lista para su uso.`
                        }
                    ]
                }
            },
            '🔑': {
                embed: {
                    fields: [
                        {
                            name: 'Tu OTP es:',
                            value: `> **${generateOtp()}** | [Iniciar Sesion](${process.env.DEPLOYMENT_URL}/login?otp=${generateOtp()})`
                        },
                    ]
                }
            }
        }


        //Seed Embed
        const menuMessage = new Discord.MessageEmbed()
              .setColor('e63946')
              .setTitle('Menu')
              .setAuthor('Carmela aka. Mami Carme', 'https://cdn-virtual.miescueladigital.com.ar/prod/picture/profile-thumb/becac416-5d7c-48b3-b753-580a2290369c', 'https://instagram.com/carmeintili?igshid=s3bczf05fdtt')
              .setDescription('Aca tenes todo lo que puedo hacer por vos bb. Selecciona la reaccion segun corresponda.')
              .addFields(
                  { name: "🙋 ***FAQ***", value: "➥ Crear eventos de Meet, organizar salas, etc." },
                  { name: "🔑 ***OTP***", value: "➥ Obtene una clave unica para iniciar sesion." }
              )
              .setTimestamp()
              .setFooter(`${user.username}`, `${user.displayAvatarURL({ dynamic: true })}`);

        const botMessage = await message.channel.send({ embed: menuMessage })
        ReactionCollector.menu({ botMessage, user: message.author, pages })
           .then(rc => {
               rc.collector.on('end', (collected, reason) => {
                   setTimeout(() => {
                       //If user setting deletes expired embed
                       if(user_settings.delete_expired_embed){ botMessage.delete() };
                       //If user setting deletes trigger msg
                       if(user_settings.delete_trigger_msg){ message.delete() };
                   }, 1000)
               })
           })
	}
};