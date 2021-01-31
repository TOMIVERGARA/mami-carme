<!--
 Copyright (c) 2021 Tomas Vergara

 This software is released under the MIT License.
 https://opensource.org/licenses/MIT
-->

<img src="./public/img/logo.svg" width="150" align="right" />

# Mami Carme <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/TOMIVERGARA/mami-carme"> <img alt="GitHub" src="https://img.shields.io/github/license/TOMIVERGARA/mami-carme">
> A productivity-focused discord bot with a simple web interface to access adavanced tools.

This bot uses Discord.js and express together with MongoDB to work. I can be used as a starting point to expand with more advanced features to fit your needs. The project is built around 3 main workers located in the src/loaders folder: 
 - `db.js`: is the most basic and handles the db connection. 
 - `bot.js`: handles the discord bot configuration and starts a message collector to look for commands in the chat and executes the corresponding code. The commands are specified in the src/commands folder and are loaded very time the server starts.
 - `server.js`: starts an Express HttpServer to handle `rest-api` requests. It also serves as a file server to handle the web interface.
 
 ## Setup to run locally
 ⚠️ To setup the project clone the repository and create a .env file following the example provided in the .env.example file.
 
 ➥ Download required dependencies:
````
npm install
````
 ➥ Start the server:
````
npm start
````
## Deployment
👉 This project makes use of the file system to make the commands more customizable. If you want to use this features please make sure to deploy the app on a service that provides a persistent file system. Solutions like Heroku will not work as intended due to Heroku's ephemeral file system. Be careful since every new resource that you upload throw the web interface will be lost after a while if not using a persistent fs.

## Todos
 - **Solve error produced when deleting the expired discord embed.** I don't know why, but when the embed is deleted discord.js throws an error.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
