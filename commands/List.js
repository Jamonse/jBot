const BotManager = require("../src/bot.manager");

module.exports = {
  name: "ls",
  description: "Lists all available audio files",
  async run(message) {
    const botManager = new BotManager(message);
    // Gets all audio files from bot manager
    const allFiles = botManager.getAudioFilesList();
    let audioList = "";
    // Creates audio files names list
    allFiles.forEach((file) => {
      const fileName = botManager.getFileName(file);
      audioList += `${fileName}\n`;
    });
    // Sends created list
    return message.channel.send(audioList);
  },
};
