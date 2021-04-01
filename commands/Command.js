const fileSystem = require("fs");
const { PREFIX } = require("..");

module.exports = {
  name: "command",
  description: "Lists all available commands",
  async run(message) {
    const commandFiles = fileSystem
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));
    let commandsList = `All commands must be prefixed with ${PREFIX} :\n`;
    let i = 1;
    commandFiles.forEach((file) => {
      const command = require(`../commands/${file}`);
      commandsList += `${i}. ${command.name} - ${command.description}\n`;
      i++;
    });

    return message.channel.send(commandsList);
  },
};
