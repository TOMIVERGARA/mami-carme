//Imports Discord.js
const Discord = require('discord.js');
const { ReactionCollector } = require('discord.js-collector');
const { getTodayBirthdayFormatted } = require('../services/get-birthday');
const { api, user_settings } = require('../../config.json');

module.exports = {
	name: 'cumpleaños',
	description: 'Birthday Module',
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
            '1️⃣': {
                embed: {
                    title: 'Añadir un cumpleaños',
                    fields: [
                        {
                            name: 'Podes añadir un nuevo cumpleañero desde la web:',
                            value: `> [Añadir Cumpleaños](${process.env.DEPLOYMENT_URL}${api.endpoints.add_birthday})`
                        }
                    ]
                }
            },
            '2️⃣': {
                embed: {
                    color: 15087942,
                    image: {
                        url: `${process.env.ENV == "DEVELOPMENT" ? 'https://i.imgur.com/VdTFube.png': `${process.env.DEPLOYMENT_URL}/${api.endpoints.get_today_birthday_story}`}`
                     }
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
                  { name: "Los cumpleañeros del dia son:", value: await getTodayBirthdayFormatted() },
                  { name: "\u200b", value: "🔍 *****Opciones Disponibles:*****" },
                  { name: "1️⃣ Añadir un Cumpleañero", value: "➥ Obtene una clave unica para iniciar sesion." },
                  { name: "2️⃣ Generar Story", value: "➥ Genera la imagen para story con los nombres de los cumpleañeros." }
              )
              .setTimestamp()
              .setFooter(`${user.username}`, `${user.displayAvatarURL({ dynamic: true })}`);

        const botMessage = await message.channel.send({ embed: menuMessage })
        ReactionCollector.menu({ botMessage, user: message.author, pages })
           .then(rc => {
               rc.collector.on('end', (collected, reason) => {
                   //If user setting deletes expired embed
                   if(user_settings.delete_expired_embed){ botMessage.delete() };
                   //If user setting deletes trigger msg
                   if(user_settings.delete_trigger_msg) message.delete();
               })
           })

	},
};