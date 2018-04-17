var Discord = require('discord.js');
var client = new Discord.Client();
var Enmap = require("enmap");
var moment = require("moment");
require("moment-duration-format");
var snekfetch = require("snekfetch");

var http = require('http');
var express = require('express');
var app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on('ready', () => {
client.user.setPresence({game: {name: `${client.guilds.size} Guilds`, url: "https://twitch.tv/shift-dev", type: "STREAMING"}});
console.log(`[READY]`, `Logged In As ${client.user.tag}`)
});

const prefix = '?';

client.on('message', message => {
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
});

client.login(process.env.TOKEN)
