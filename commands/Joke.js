const BotManager = require("../src/bot.manager");

module.exports = {
  name: "joke",
  description: "Tells a random joke",
  async run(message) {
    const botManager = new BotManager(message);
    const joke = await botManager
      .getRandomJoke() // Fetch joke
      .then((response) => response.json()); // Get body
    // Send joke punchline as a spoiler
    message.channel.send(`${joke.setup}\n||${joke.punchline}||`);
  },
};
