const BotManager = require("../src/bot.manager");

module.exports = {
  name: "stop",
  description: "Stops currently played audio",
  async run(message) {
    const botManager = new BotManager(message);
    botManager.stopPlaying();
  },
};
