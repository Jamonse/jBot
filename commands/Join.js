const BotManager = require("../src/bot.manager");

module.exports = {
  name: "join",
  description: "Joins voice channel",
  async run(message) {
    const botManager = new BotManager(message);
    botManager.joinVoiceChannel("Its'a me!", "Im already here...");
  },
};
