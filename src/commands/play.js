module.exports = {
  name: "play",
  description: "Plays audio from directory or URL",
  async performComman(message) {
    const voiceChannel = message.member.voice.channel;
    const audioName = message.content;
    if (!voiceChannel) {
      message.reply(" you must be in a voice channel to play audio");
    }

    const requiredPermissions = voiceChannel.permissionsFor(
      message.client.user
    );
    if (
      !requiredPermissions.has("CONNECT") ||
      !requiredPermissions.has("SPEAK")
    ) {
      message.channel.send(
        "I do not have permission to join or play audio in your channel"
      );
    }

    if (
      audioName && // Audio is URL
      (audioName.includes("https://") || audioName.includes("youtube"))
    ) {
      const connection = await voiceChannel.join();
      const clientConnection = message.client.connection;
      clientConnection = connection.play(await ytdl(audioName));
      break;
    } // Get files from audio directory
  },
};
