# jBot

jBot is an audio playing bot for discord servers developed with discord.js API.

## Features

- Play voice records from audio director or youtube URL.
- List all available records in audio directory.
- Simple commands and command listing.

## Usage

In order to start the bot and add it to your server, you need to first complete the following tasks:

1. Create a .env file in the root of the project with the value JBOT_TOKEN=<you_bot_token>
2. Create directory named `audio` in the root of the project and place all the audio records you wish to play (the files names are important as they are used to play them).
3. Add the bot to your server using the discord OAuth2 API.

Install and run the bot using npm:

```
$ cd ../root
$ npm install
$ npm run start
```

### Commands

All commands must be prefixed with $_

1. join - adds the bot to your voice channel.
2. play <record_name / url> - plays an audio file from audio directory or from a url.
3. ls - lists all available audio files in audio directory.
4. stop - stops currently played audio.
5. command - lists all commands.
6. exit - leaves voice channel
