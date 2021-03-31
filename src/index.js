require("dotenv").config();

const ytdl = require("ytdl-core");
const { Client } = require("discord.js");
const fileSystem = require("fs");
const path = require("path");

const client = new Client();
const token = process.env.JBOT_TOKEN;
const PREFIX = "$_";

let currentlyPlaying;

client.login(token); // Login as the bot
client.on("ready", () => {});
client.on("message", async (message) => {
  // Listen to messages in text channel
  const memberMesage = message.content;
  const memberTextChannel = message.channel;
  // Check that message is prefixed and not a bot message
  if (!memberMesage.startsWith(PREFIX) || message.author.bot) {
    return;
  } // Init the summoning member voice channel
  const memberVoiceChannel = message.member.voice.channel;
  if (!memberVoiceChannel) {
    // Member is not in voice channel
    message.reply(" you must be in a voice channel to command me");
  } else {
    // Get the bot channel
    const botChannel = client.voiceChannelId;
    const command = removePrefix(memberMesage);
    // Join the channel for join command and if bot is not yet in channel
    switch (command) {
      case (command.match(/^join/) || {}).input: // Join command - joins voice channel
        memberVoiceChannel.join();
        memberTextChannel.send("Its'a me!");
        break;
      case (command.match(/^play/) || {}).input: // Play command - plays audio
        let audioName = command.substring(PREFIX.length()).trim();
        if (!audioName) {
          message.reply(
            // Commander is not in a voice channel
            "You should add recording name or url after play command"
          );
          break;
        }
        if (
          audioName && // Audio is URL
          (audioName.includes("https://") || audioName.includes("youtube"))
        ) {
          const connection = await memberVoiceChannel.join();
          currentlyPlaying = connection.play(await ytdl(audioName));
          break;
        } // Get files from audio directory
        const files = getAudioFilesList();
        if (!files) {
          // No fiels found
          memberTextChannel.send("No voice records yet.");
          break;
        } // Try and match requested audio name with audio files available
        audioName = audioName.toLowerCase();
        const audioToPlay = files.find((file) =>
          file.toLowerCase().startsWith(audioName)
        ); // No match
        if (!audioToPlay) {
          memberTextChannel.send(`Sorry, could not find audio: ${audioName}`);
          break;
        } // Match! start connection and send play message
        const connection = await memberVoiceChannel.join();
        const fileName = getFileName(audioToPlay);
        currentlyPlaying = connection.play(`audio/${audioToPlay}`);
        currentlyPlaying.on("start", () =>
          memberTextChannel.send(`Now playing ${fileName}`)
        );
        break;
      case (command.match(/^stop/) || {}).input: // Stop case - stop currently plating audio
        if (currentlyPlaying) {
          currentlyPlaying.end();
        }
        break;
      case (command.match(/^ls/) || {}).input: // List command - list all available audios in directory
        const allFiles = getAudioFilesList().map(getFileName);
        memberTextChannel.send(allFiles);
        break;
      case (command.match(/^command/) || {}).input: // Command - list all available commands
        memberTextChannel.send(
          `Available commands: \n 1. ${PREFIX}play <audio_name or url> \n 2. ${PREFIX}join - joins your voice channel \n 3. ${PREFIX}ls - lists all available voice records \n 4. ${PREFIX}command - lists all available commands \n 5. ${PREFIX}stop - stops currently played audio`
        );
        break;
      case (command.match(/^exit/) || {}).input: // Exit - leave voice channel
        const channel = message.guild.me.voice.channel;
        if (channel) {
          channel.leave();
        }
        break;
      default:
        // No command match
        message.reply(`Sorry, could not find command: ${command}`);
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

function getFileName(filePath) {
  const fileExtention = path.extname(filePath);
  return path.basename(filePath, fileExtention);
}

function getAudioFilesList() {
  const allFiles = fileSystem.readdirSync("audio");
  if (allFiles) {
    return allFiles;
  }
  return false;
}
