//Imports Discord.js
const Discord = require('discord.js');
const { ReactionCollector } = require('discord.js-collector')

module.exports = {
	name: 'ayuda',
	description: 'Main Menu',
	async execute(message, args) {
        const user = message.author
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
        const pages = {
            '1️⃣': {
                embed: {
                    ...embeedSettings,
                    title: 'Recordatorios ⏰',
                    description: `Estas son todas las opciones de recordatorios. Selecciona la reaccion segun corresponda.`,
                    fields: [
                        {
                            name: "🎂 Cumpleaños",
                            value: "Lista de los cumpleañeros del dia."
                        },
                        {
                            name: "📔 Tareas",
                            value: "Recopilatorio de las tareas pendientes."
                        }
                    ]
                },
                reactions: ['🎂', '📔'],
                pages: {
                    '🎂': {
                        backEmoji: '⏪',
                        embed: {
                            ...embeedSettings,
                            title: 'Cumpleaños 🎂',
                            description: `Estas son todas las opciones para cumpleaños. Selecciona la reaccion segun corresponda.`,
                            fields: [
                                {
                                    name: "🎂 Cumpleaños",
                                    value: "Lista de los cumpleañeros del dia."
                                },
                                {
                                    name: "📔 Tareas",
                                    value: "Recopilatorio de las tareas pendientes."
                                }
                            ]
                        }
                    }
                }
            },
            '2️⃣': {

            }
        }

        const menuMessage = new Discord.MessageEmbed()
              .setColor('e63946')
              .setTitle('Menu')
              .setAuthor('Carmela aka. Mami Carme', 'https://cdn-virtual.miescueladigital.com.ar/prod/picture/profile-thumb/becac416-5d7c-48b3-b753-580a2290369c', 'https://instagram.com/carmeintili?igshid=s3bczf05fdtt')
              .setDescription('Aca tenes todo lo que puedo hacer por vos bb. Selecciona la reaccion segun corresponda.')
              .addFields(
                  { name: "1️⃣ ***Recordatorios***", value: "➥ Cumpleaños, Tareas, Eventos, etc." },
                  { name: "2️⃣ ***Reuniones***", value: "➥ Crear eventos de Meet, organizar salas, etc." },
              )
              .setTimestamp()
              .setFooter(`${user.username}`, `${user.displayAvatarURL({ dynamic: true })}`);

        const botMessage = await message.channel.send(menuMessage)
        ReactionCollector.menu({ botMessage, user: message.author, pages });


	},
};