require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();
const token = process.env.JBOT_TOKEN;
console.log(token);

client.login(token);

client.on("ready", () => {});

client.on("message", (message) => {
  if (!message.content.startsWith("$_")) {
    return;
  }
});

function playRecord(recordName, message) {}

function joinVoiceChannel(message) {}
