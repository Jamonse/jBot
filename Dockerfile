# Save node AS build
FROM node:12-alpine AS build

# Create working directory
WORKDIR /usr/src/jbot

# Copy page.json and package-lock.json to root
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy into working directory
COPY . /usr/src/jbot

# Build only actual image
FROM node:12-alpine
WORKDIR /usr/src/jbot
COPY --from=build /usr/src/jbot .

# Run the bot
# Remember to create / copy audio directoryinside the container inject bot token as an EV
# - when running the image on a container (-e JBOT_TOKEN=<your_token>)
# - or better using Docker Secrets
CMD [ "node", "index.js" ]