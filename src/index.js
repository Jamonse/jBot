require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();
const token = process.env.JBOT_TOKEN;
const PREFIX = "$_";

client.login(token); // Login as the bot
client.on("ready", () => {});
client.on("message", async (message) => {
  // Listen to messages in text channel
  const memberMesage = message.content;
  // Check that message is prefixed and not a bot message
  if (!memberMesage.startsWith(PREFIX) || message.author.bot) {
    return;
  } // Init the summoning member voice channel
  const memberVoiceChannel = message.member.voice.channel;
  if (!memberVoiceChannel) {
    // Member is not in voice channel
    message.reply(" you must be in a voice channel to play audio");
  } else {
    // Get the bot channel
    const botChannel = client.voiceChannelId;
    const command = removePrefix(memberMesage);
    // Join the channel for join command and if bot is not yet in channel
    if (!botChannel && command === "join") {
      const connection = await memberVoiceChannel.join();
      const dispatcher = connection.play("audio/file.mp3");
    }
  }
});
client.on("voiceStateUpdate", (oldState, newState) => {
  // Listen to voice channel state changes
  if (
    // State update is not in bots voice channel
    oldState.channelID !== oldState.guild.me.voice.channelID ||
    newState.channel
  ) {
    return;
  } // Get bots channel members count
  const channelMembersCount = oldState.channel.members.size;
  if (!channelMembersCount - 1) {
    // Only the bot is currently in channel
    setTimeout(() => {
      // Wait 5 minutes
      if (channelMembersCount - 1) {
        // The bot is still alone in channel, leave
        oldState.channel.leave();
      }
    }, 300000);
  }
});

function removePrefix(command) {
  return command.substring(2);
}
