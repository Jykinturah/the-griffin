"use strict";

const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

var bot;

const Config = require("./config.json");
const prefix = Config.prefix || "!";

var busy = false;
var statusArray = ["CHIRRUP", "CHIRP", "TWEET", "SING", "WARBLE", "HONK", "QUACK", "SQUAWK", "PARROT", "MEOW", "PURR", "CHATTER"];
var sounds = {
	"sloppy": {file: function(){return  "sloppy.ogg"}},
	"scream": {file: function(){return  "scream.ogg"}},
	"namedays": {file: function(){return "namedays.ogg"}},
	"raubahnsavage" : {file: function(){return "namedays.ogg"}},
	"illusion" : {file: function(){
		var random = Math.floor(Math.random() * 4);
		switch(random){
			case 0: return "illusion/female1.ogg";
			case 1: return "illusion/female2.ogg";
			case 2: return "illusion/male1.ogg";
			case 3: return "illusion/male2.ogg";
		}
	}},
	"fillusion" : {file: function(){
		var random = Math.floor(Math.random() * 2);
		switch(random){
			case 0: return "illusion/female1.ogg";
			case 1: return "illusion/female2.ogg";
		}
	}},
	"millusion" : {file: function(){
		var random = Math.floor(Math.random() * 2);
		switch(random){
			case 0: return "illusion/male1.ogg";
			case 1: return "illusion/male2.ogg";
		}
	}}
}

bot = new Discord.Client();

bot.on("ready", () => {
	console.log("BIRB is Ready.");
    bot.user.setActivity(`${statusArray[Math.floor(Math.random() * statusArray.length)]}`,{type:'PLAYING'})
    	.then(presence => console.log(`Set activity to ${presence.game ? presence.game.name : 'none'}`))
    	.catch(err => console.log(err));

	var statusTime = 10 * 60 * 1000;
	setInterval( () => {
	    bot.user.setActivity(`${statusArray[Math.floor(Math.random() * statusArray.length)]}`,{type:'PLAYING'})
	    	.then(presence => console.log(`Set activity to ${presence.game ? presence.game.name : 'none'}`))
	    	.catch(err => console.log(err));
	},statusTime);
});

bot.on("message", (msg) => {
	if(msg.author.bot) return;

	// mention
	if(msg.content.includes(bot.user.id)){
		msg.channel.send(`${statusArray[Math.floor(Math.random() * statusArray.length)]}!! ${msg.content}!!`);
	}

	if ( !msg.content.startsWith(prefix) || !msg.member){
		return;
	}

	let command = msg.content.split(" ")[0].substring(1);

	if(command.startsWith("ping")){
		msg.channel.send(`PONG! \`${new Date().getTime() - msg.createdAt} ms\``);
		console.log(`PING [ ${msg.channel.guild.name} / ${msg.channel.name} ] ${msg.author.tag}: ${msg.content}`);
	}else if( !busy && msg.member.voiceChannel ){
		var soundTarget = sounds[command];

		if(soundTarget){
			busy = true;
			var targetChannel = msg.member.voiceChannel;
			targetChannel.join().then((con) => {
				const dispatcher = con.playFile(path.join(__dirname, "media", soundTarget.file()));
				console.log(`PLAY [ ${msg.channel.guild.name} / ${msg.channel.name} ] ${msg.author.tag}: ${msg.content}`);
				dispatcher.on("end", end => {
					targetChannel.leave();
					setTimeout(() => {busy = false},100);
				});
			}).catch(err => console.log(err));
		}
	}
});

bot.login(Config.bot_token);