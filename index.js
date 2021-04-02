require("dotenv").config();

const fileSystem = require("fs");
const JBotClient = require("./src/client");
const { Collection } = require("discord.js");

const token = process.env.JBOT_TOKEN;
const PREFIX = "!"; // Commands prefix
const client = new JBotClient();

module.exports = {
  PREFIX,
};

client.commands = new Collection();
// Get all command modules
const commandFiles = fileSystem
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
// Set command modules to the client
commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

client.on("ready", () => {
  console.log("Online!");
});

client.on("reconnecting", () => {
  console.log("Reconnecting...");
});

client.on("disconnect", () => {
  console.log("Disconnected");
});

client.on("message", (message) => {
  if (message.author.bot) {
    return; // Message from bot
  }
  if (!message.content.startsWith(PREFIX)) {
    return; // Message without prefix
  }
  // Get audio name from command
  const audioName = message.content.slice(PREFIX.length).split(/ +/);
  // Get command name
  const commandName = audioName.shift().toLowerCase();
  // Get command using the command name specified
  const command = client.commands.get(commandName);

  try {
    // Try to run the command
    command.run(message, audioName);
  } catch (error) {
    // Command not found
    console.error(error);
    message.reply(`Sorry, could not find command: ${commandName}`);
  }
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    newState.channel
  ) {
    return;
  }
  if (oldState.channel.members.size == 1) {
    setTimeout(() => {
      if (oldState.channel.members.size == 1) {
        oldState.channel.leave();
      }
    }, 300000);
  }
});

client.login(token);
