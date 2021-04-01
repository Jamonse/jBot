const BotManager = require("../src/bot.manager");

module.exports = {
  name: "exit",
  description: "Leaves voice channel",
  async run(message) {
    const botManager = new BotManager(message);
    botManager.leaveVoiceChannel("Cya!");
  },
};
