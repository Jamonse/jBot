const { Client } = require("discord.js");

module.exports = class extends Client {
  constructor(config) {
    super({
      disableEveryone: true,
      disabledEvents: ["TYPING_START"],
    });

    this.commands = new Collection();
    this.config = config;
    this.connection = null;
  }
};
