const AUDIO_DIRECTORY = "audio";
const fileSystem = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const fetch = require("node-fetch");

const RANDOM_AUDIO = "random";
const JOKE_API = process.env.JOKE_API;

module.exports = class BotManager {
  constructor(message) {
    this.message = message;
    // Commander voice channel
    this.voiceChannel = message.member.voice.channel;
    // Commander text channel
    this.textChannel = message.channel;
    // Bot current voice channel
    this.botVoiceChannel = message.guild.me.voice.channel;
  }

  joinVoiceChannel(greetingMessage, falseAlertMessage) {
    if (!this.voiceChannel) {
      if (this.botVoiceChannel) {
        return true;
      }
      // Commander is not in voice channel
      this.message.reply(
        "you must be in a voice channel in order for me to join"
      );
      return false;
    }

    const permissions = this.voiceChannel.permissionsFor(
      this.message.client.user
    );
    if (!permissions.has("CONNECT")) {
      // Bot does not have permission to join voice channel
      this.textChannel.send(
        "Sorry, i do not have a permission to join your voice channel"
      );
      return false;
    }

    if (
      !this.botVoiceChannel ||
      this.botVoiceChannel.id != this.voiceChannel.id
    ) {
      if (greetingMessage) {
        this.textChannel.send(greetingMessage); // Send greetings
      }
    } else {
      if (falseAlertMessage) {
        // Bot is already in commander voice channel
        this.message.reply(falseAlertMessage);
      }
    }
    return this.voiceChannel.join(); // Join voice channel
  }

  async playAudio(audioToPlay) {
    const connection = await this.joinVoiceChannel(); // Connect to voice channel
    if (!connection) {
      // Could not connect to voice channel
      return;
    }
    if (!this.voiceChannel) {
      // Bot is already in voice channel but commander is not
      return this.message.reply(
        "You must be in a voice channel in roder to play audio"
      );
    }
    if (!audioToPlay || audioToPlay == "") {
      // Audio to play is empty
      return this.message.reply(
        // Commander is not in a voice channel
        "You should add recording name or url after play command"
      );
    } // Audio to play us youtube URL
    if (audioToPlay[0].includes("youtube.com")) {
      return this._playFromUrl(audioToPlay, connection);
    } // Audio to play is an audio file
    return this._playFromFile(audioToPlay, connection);
  }

  async _playFromUrl(videoUrl, connection) {
    if (videoUrl && connection) {
      try {
        // Play from youtube URL
        return (this.message.guild.client.dispatcher = connection.play(
          await ytdl(videoUrl)
        ));
      } catch (err) {
        // Could not play youtube URL
        console.error(err);
        return this.message.reply(
          "Sorry, could not play from url, probably because the url is invalid or video does not exist anymore"
        );
      }
    }
  }

  async _playFromFile(audioFile, connection) {
    const files = this.getAudioFilesList(); // Get files from audio directory
    if (!files || !files.length) {
      // No fiels found
      return this.textChannel.send("No voice records yet.");
    } // Try to match requested audio name with audio files available
    audioFile = `${audioFile.join(" ")}`.toLowerCase();
    console.log(audioFile);
    const audioToPlay =
      audioFile == RANDOM_AUDIO
        ? this._getRandomAudioFile(files) // Play random audio from audio files list
        : files.find(
            // Play requested audio
            (file) => this.getFileName(file.toLowerCase()) == audioFile
          ); // No match
    if (!audioToPlay) {
      return this.textChannel.send(`Sorry, could not find audio: ${audioFile}`);
    } // Match! start connection and send play message
    const fileName = this.getFileName(audioToPlay);
    this.message.guild.client.dispatcher = connection.play(
      `${AUDIO_DIRECTORY}/${audioToPlay}`
    ); // Send play message
    this.message.guild.client.dispatcher.on("start", () =>
      this.textChannel.send(`Now playing ${fileName}`)
    );
  }

  async getRandomJoke() {
    return await fetch(JOKE_API);
  }

  getAudioFilesList() {
    // Return all files from audio directory
    const allFiles = fileSystem.readdirSync(AUDIO_DIRECTORY);
    if (allFiles) {
      return allFiles;
    }
    return false;
  }

  getFileName(filePath) {
    // Get file name from file path
    const fileExtention = path.extname(filePath);
    return path.basename(filePath, fileExtention);
  }

  _getRandomAudioFile(files) {
    const min = 0;
    const max = files.length - 1;
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    // Gets audio file from random index
    return files[randomIndex];
  }

  stopPlaying() {
    if (this.inCommanderVoiceChannel()) {
      const dispatcher = this.message.guild.client.dispatcher;
      if (dispatcher) {
        // Stop currently playing audio
        dispatcher.end();
      }
    }
  }

  leaveVoiceChannel(leavingMessage) {
    if (this.inCommanderVoiceChannel()) {
      // Bot is in the commander channel
      if (leavingMessage) {
        this.textChannel.send(leavingMessage);
      } // Leave voice channel
      this.voiceChannel.leave();
    }
  }

  inCommanderVoiceChannel() {
    return this.botVoiceChannel && this.botVoiceChannel == this.voiceChannel;
  }
};
