"use strict";

const Eris = require("eris");
const fs = require("fs");
const path = require("path");

const Config = require("./config.json");


// Study this https://github.com/nicholastay/discord-fx
// This is currently incomplete.
class TheGriffin {
    constructor() {
        console.log("FFXIV BUILT");

        this.client = null;
        this.connQueues = {};
        this.prefix = Config.prefix || "!";

        if (!Config.bot_token) throw new Error("No token in config");
    }

    start() {
        this.client = new Eris(Config.bot_token);
        this.attachEvents();
        this.client.connect();
    }

    attachEvents() {
        this.client.on("ready", () => console.log("Ilberd is Ready."));
        this.client.on("disconnect", () => console.log("Ilberd is strugglin'. Reconnecting..."));
        this.client.on("messageCreate", this.handleMessage.bind(this));
    }
    handleMessage(message) {
        if (!message.content.startsWith(this.prefix)
         || !message.member // PM
         || !message.member.voiceState
         || !message.member.voiceState.channelID)
            return;

        let existingConn = this.client.voiceConnections.find(vc => vc.id === message.channel.guild.id);

        let ogg = -1;
        if(message.content.startsWith(this.prefix + "sloppy"))
        	ogg = path.join(__dirname, "sloppy.ogg");
        else if(message.content.startsWith(this.prefix + "scream"))
        	ogg = path.join(__dirname, "scream.ogg");

        if(ogg != -1){

        	console.log(`${message.channel.guild.name} :: #${message.channel.name} // ${message.author.username}#${message.author.discriminator} ~~ FX: SLOPPY`);

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
