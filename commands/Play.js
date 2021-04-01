const BotManager = require("../src/bot.manager");

module.exports = {
  name: "play",
  description: "Plays audio in voice channel",
  async run(message, audioName) {
    const botManager = new BotManager(message);
    botManager.playAudio(audioName);
  },
};
