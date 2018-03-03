"use strict";

const Eris = require("eris");
const fs = require("fs");
const path = require("path");

const Config = require("./config.json");


/*------------------------------------------------
Most of the code was from here, and modified by me
just to learn how this worked. Very educational.
 
   https://github.com/nicholastay/discord-fx

------------------------------------------------*/

//  chirrup, chirp, tweet, sing, warble, honk, quack, squawk, parrot, meow, purr, chatter 

class TheGriffin {
    constructor() {
        console.log("BIRB BUILT");

        this.client = null;
        this.connQueues = {};
        this.prefix = Config.prefix || "!";

        if (!Config.bot_token) throw new Error("No token in config");
    }

    start() {
        this.client = new Eris(Config.bot_token);
        this.attachEvents();
        this.client.connect();

        var onomArray = ["CHIRRUP", "CHIRP", "TWEET", "SING", "WARBLE", "HONK", "QUACK", "SQUAWK", "PARROT", "MEOW", "PURR", "CHATTER"];
        var onomIndex = parseInt(Math.random() * onomArray.length);
		console.log("Set status: " + onomArray[onomIndex]);
	    this.client.editStatus({ name: "noise: " + onomArray[onomIndex]});
		var onomSet = 5 * 1000;
		setInterval(()=>{
			var onomIndex = parseInt(Math.random() * onomArray.length);
			console.log("Set status: " + onomArray[onomIndex]);
		    this.client.editStatus({ name: "noise: " + onomArray[onomIndex]});
		},onomSet);
    }

    attachEvents() {
        this.client.on("ready", () => console.log("BIRB is Ready."));
        this.client.on("disconnect", () => console.log("BORIRB is strugglin'. Reconnecting..."));
        this.client.on("messageCreate", this.handleMessage.bind(this));
    }
    handleMessage(message) {
        if (!message.content.startsWith(this.prefix)
         || !message.member // PM
         || !message.member.voiceState
         || !message.member.voiceState.channelID)
            return;

        let existingConn = this.client.voiceConnections.find(vc => vc.id === message.channel.guild.id);

        let ogg = -1; // I just wanted it to do one thing but my friend was like ADD WILHELM sigh.
        if(message.content.startsWith(this.prefix + "sloppy"))
        	ogg = path.join(__dirname, "sloppy.ogg");
        else if(message.content.startsWith(this.prefix + "scream"))
        	ogg = path.join(__dirname, "scream.ogg");
        else if(message.content.startsWith(this.prefix + "namedays"))
        	ogg = path.join(__dirname, "namedays.ogg");
        else if(message.content.startsWith(this.prefix + "raubahnsavage"))
        	ogg = path.join(__dirname, "namedays.ogg");
        else if(message.content.startsWith(this.prefix + "illusion")){
        	var random = Math.floor(Math.random() * 4);
        	switch(random){
        		case 0: ogg = path.join(__dirname, "illusion/female1.ogg"); break;
        		case 1: ogg = path.join(__dirname, "illusion/female2.ogg"); break;
        		case 2: ogg = path.join(__dirname, "illusion/male1.ogg"); break;
        		case 3: ogg = path.join(__dirname, "illusion/male2.ogg");
        	}
        else if(message.content.startsWith(this.prefix + "fillusion")){
        	var random = Math.floor(Math.random() * 2);
        	switch(random){
        		case 0: ogg = path.join(__dirname, "illusion/female1.ogg"); break;
        		case 1: ogg = path.join(__dirname, "illusion/female2.ogg");
        	}
        else if(message.content.startsWith(this.prefix + "millusion")){
        	var random = Math.floor(Math.random() * 2);
        	switch(random){
        		case 0: ogg = path.join(__dirname, "illusion/male1.ogg"); break;
        		case 1: ogg = path.join(__dirname, "illusion/male2.ogg");
        	}
        }else if(message.content.startsWith(this.prefix + "ping")){
        	this.client.createMessage(message.channel.id, "PONG! " + (Date.now() - message.timestamp) + "ms");
        	console.log(`${message.channel.guild.name} :: #${message.channel.name} // ${message.author.username}#${message.author.discriminator} ~~ PING`)
        }

        if(ogg != -1){

        	console.log(`${message.channel.guild.name} :: #${message.channel.name} // ${message.author.username}#${message.author.discriminator} ~~ FX: ${message.content}`);

        	// still not sure what this does, seems to make a queue so commands don't just vanish? and then
        	// uses promises to play them so it doesn't just get lost.
            if (existingConn) {
                if (this.connQueues[message.member.voiceState.channelID].length > 4)
                    return;
                this.connQueues[message.member.voiceState.channelID].push(ogg);
            } else {
                this.connQueues[message.member.voiceState.channelID] = [];
                this.client.joinVoiceChannel(message.member.voiceState.channelID).then(conn => {
                    conn.play(ogg, { format: "ogg" });
                    conn.on("end", () => {
                        if (this.connQueues[message.member.voiceState.channelID].length < 1) {
                            delete(this.connQueues[message.member.voiceState.channelID]);
                            return this.client.leaveVoiceChannel(message.member.voiceState.channelID);
                        }
                        conn.play(this.connQueues[message.member.voiceState.channelID].shift(), { format: "ogg" });
                    });
                }).catch(console.log);
            }
	    }
    }
}

const bot = new TheGriffin();
global.Griffin = bot;
bot.start();

