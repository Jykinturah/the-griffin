"use strict";

const eris = require("eris");
const fs = require("fs");
const path = require("path");

const config = require("config.json");


// Study this https://github.com/nicholastay/discord-fx
// This is currently incomplete.
class TheGriffin {
    constructor() {
        console.log("FFXIV START");

        this.client = null;
        this.voiceQ = {};
        this.prefix = config.prefix || "!";

        if (!config.discord.token) throw new Error("No token in config");
    }
}