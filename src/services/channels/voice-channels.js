const Discord = require('discord.js');
const { user_settings } = require('../../../config.json')

const deleteEmptyChannelAfterDelay = (voiceChannel, delayMS = 10000) => {
	if(!voiceChannel) return;
    if(voiceChannel.members.first()) return;
    if(!voiceChannel.health) voiceChannel.health = 0;
    voiceChannel.health += 1;
    setTimeout(function(){	//queue channel for deletion and wait
		if(!voiceChannel) return;
        if(voiceChannel.members.first()) return;
        voiceChannel.health -= 2;
        if(voiceChannel.health > 0) return;
		voiceChannel.delete()	//delete channel
			.catch(error => console.log(error));
	}, delayMS);
}

module.exports.deleteEmptyChannelAfterDelay = deleteEmptyChannelAfterDelay;

module.exports.createVoiceChannel = async (message, channelName, private) => {
    let category = message.guild.channels.cache.find(c => c.name == user_settings.voice_channels_category_name && c.type == "category");
    let channel = await message.guild.channels.create(user_settings.automatic_channels_have_indicator ? `👾 ${channelName}` : channelName, {
        type: 'voice',
        permissionOverwrites: private ? [
            {
                id: message.guild.roles.everyone,
                deny: ['CONNECT']
            },
            {
                id: message.member.roles.cache.first().id,
                allow: ['CONNECT']
            }
        ] : [],
        parent: category ? category.id : null
    });

    deleteEmptyChannelAfterDelay(channel, 30000);
    if (!category) throw new RangeError("Category channel does not exist");
}

module.exports.lockVoiceChannel = voiceChannel => {
    let everyone,
        promise,
        perms,
        promises = [];

    //Reset CONNECT overwrites
    perms = voiceChannel.permissionOverwrites.map(overwrite => ({
        deny: overwrite.denied.remove('CONNECT').bitfield,
        allow: overwrite.allowed.remove('CONNECT').bitfield,
        id: overwrite.id,
        type: overwrite.type,
    }));

    promise = voiceChannel.edit({
        permissionOverwrites: perms
    });

    //Set CONNECT on for current members (and this bot)
    promise = promise.then(() => {
        promises = [];
        voiceChannel.members.forEach(member => {
            promises.push(voiceChannel.overwritePermissions(member, {
                'CONNECT': true
            }));
        });

        promises.push(voiceChannel.overwritePermissions(voiceChannel.client.user, {
            'CONNECT': true
        }));

        return Promise.all(promises);
    });

    //Set CONNECT off for all roles
    promise = promise.then(() => {
        let promises = [];

        voiceChannel.guild.roles.forEach(role => {
            promises.push(voiceChannel.overwritePermissions(role, {
                'CONNECT': false
            }));
        });

        return Promise.all(promises);
    });

    return promise;

}