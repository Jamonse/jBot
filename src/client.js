const { Client, Collection } = require("discord.js");

module.exports = class JBotClient extends Client {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ["TYPING_START"],
    });

    this.commands = new Collection();
    this.config = config;
    this.dispatcher = null;
  }
};
