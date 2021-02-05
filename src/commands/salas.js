//Imports Discord.js
const Discord = require('discord.js');
const _ = require('lodash')
const { ReactionCollector } = require('discord.js-collector');
const { MessageCollector } = require("discord.js-collector");
const { user_settings } = require('../../config.json');
const { createVoiceChannel, lockVoiceChannel } = require('../services/channels/voice-channels')

module.exports = {
	name: 'salas',
	description: 'Voice Rooms Module',
	async execute(message, args) {
        //Defines Message Author
        const user = message.author

        const createAutomaticVoiceChannel = async (botMessage, private) => {
            const roomNameEmbed = new Discord.MessageEmbed()
              .setColor('e63946')
              .setTitle('Envia el nombre de la sala')
              .setDescription('Tenes 30 segundos para responder');

            botMessage.edit(roomNameEmbed)
            const roomNameMsg = await MessageCollector.asyncQuestion({ botMessage, user: message.author.id });
            roomNameMsg.delete();
            createVoiceChannel(message, roomNameMsg.content, private)
            .then(() => {
                botMessage.delete();
                message.reply(`canal creado 🥳. ¡Tenes 30 segundos para ingresar! Cuando todos los participantes dejen el canal lo voy a borrrar automaticamente.`);
                //If user setting deletes trigger msg
                if(user_settings.delete_trigger_msg){ message.delete() };
                return;
            })
            .catch(error => {
                if (error instanceof RangeError) {
                  console.error(`➥ The specified voice channel category name does not exist on the ds server.`);
                  //If user setting deletes expired embed
                  botMessage.delete();
                  message.reply(`hubo un pequeño error. No pude encontrar la categoría "Voice Channels" para añadir el canal de voz asi que lo añadí al principio de la lista de canales. Porfavor revisa la configuración para solucionar el problema.`);
                  //If user setting deletes trigger msg
                  if(user_settings.delete_trigger_msg){ message.delete() };
                  return;
                }
            })
        }

        const lockChannel = async botMessage => {
            botMessage.delete();
            let voiceChannel = message.member.voice.channel,
                userCount;

            if (voiceChannel == null) {
                message.reply(`no estas conectado a ningun canal de voz que pueda bloquear.`);
                return;
            }

            // if (voiceChannel.parentID !== message.channel.parentID) {
            //     message.reply(`no tengo permisos para manipular este canal.`);
            //     return;
            // }

            userCount = voiceChannel.members.size;

            if (userCount === 1) {
                message.reply(`mijin, no voy a bloquear el canal porque sos el unico adentro.`);
                return;
            }

            lockVoiceChannel(voiceChannel).then(() => {
                message.reply(`canal bloqueado 👩‍✈️`);
            })
        }

        //Seed Embed
        const menuMessage = new Discord.MessageEmbed()
              .setColor('e63946')
              .setTitle('Menu')
              .setAuthor('Carmela aka. Mami Carme', 'https://cdn-virtual.miescueladigital.com.ar/prod/picture/profile-thumb/becac416-5d7c-48b3-b753-580a2290369c', 'https://instagram.com/carmeintili?igshid=s3bczf05fdtt')
              .setDescription('Aca tenes todo lo que puedo hacer por vos bb. Selecciona la reaccion segun corresponda.')
              .addFields(
                  { name: "1️⃣ Crear sala por rol", value: "➥ Crea una sala que solo permite el acceso de personas con el rol seleccionado." },
                  { name: "2️⃣ Crear sala automatica", value: "➥ Crea una sala libre que se elimina cuando permanece vacia por un tiempo." },
                  { name: "3️⃣ Bloquear Sala", value: "➥ Permite bloquear el ingreso a la sala seleccionada." }
              )
              .setTimestamp()
              .setFooter(`${user.username}`, `${user.displayAvatarURL({ dynamic: true })}`);

        const botMessage = await message.channel.send({ embed: menuMessage });
        ReactionCollector.question({
            botMessage,
            user: message.author,
            reactions: {
                '1️⃣': async () => await createAutomaticVoiceChannel(botMessage, true),
                '2️⃣': async () => await createAutomaticVoiceChannel(botMessage, false),
                '3️⃣': async () => setTimeout(async () => await lockChannel(botMessage), 1000)
            }
        })
        .then(rc => {
            rc.on('end', (collected, reason) => {
                if(_.isEmpty(collected)){
                   setTimeout(() => {
                       //If user setting deletes expired embed
                       if(user_settings.delete_expired_embed){ botMessage.delete() };
                       //If user setting deletes trigger msg
                       if(user_settings.delete_trigger_msg){ message.delete() };
                   }, 1000)
                }
            })
        })

	},
};