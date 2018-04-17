var Discord = require('discord.js');
var client = new Discord.Client();
var Enmap = require("enmap");
const EnmapLevel = require('enmap-level');
const settings = new Enmap({provider: new EnmapLevel({name: "settings"})});
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

client.on("guildCreate", guild => {
  settings.set(guild.id, defaultSettings);
});

client.on("guildDelete", guild => {
  settings.delete(guild.id);
});

const defaultSettings = {
  prefix: "?",
  modLogChannel: "mod-log",
  modRole: "Moderator",
  adminRole: "Administrator",
  welcomeChannel: "welcome",
  welcomeMessage: "Welcome {{user}} To Our Server! Have A Good Time Here"
}

client.on("guildMemberAdd", member => {
  const guildConf = settings.get(member.guild.id);
  const welcomeMessage = guildConf.welcomeMessage.replace("{{user}}", member.user.tag)
  member.guild.channels.find("name", guildConf.welcomeChannel).send(welcomeMessage).catch(console.error);
});

client.on("message", async (message) => {
  if(!message.guild || message.author.bot) return;
  const guildConf = settings.get(message.guild.id);
  if(message.content.indexOf(guildConf.prefix) !== 0) return;
  const args = message.content.slice(guildConf.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (command === 'help') {
  const embed = new Discord.RichEmbed()
  .addField('Shift's Commands', 'Here Are My Commands')
  .addField('Settings', `SetConf - Changes The Guilds Settings\n\nShowConf - Shows The Servers Current Config`)
  message.channel.send({embed});
  }
  
    if(command === "setconf") {
    const adminRole = message.guild.roles.find("name", guildConf.adminRole);
    if(!adminRole || !message.member.has(adminRole.id)) return message.reply("You're Not An Admin, Sorry!")
    const key = args[0];
    if(!guildConf.hasOwnProperty(key)) return message.reply("This Key Is Not In The Configuration.");
    guildConf[key] = value;
    settings.set(message.guild.id, guildConf);
    message.channel.send(`Guild Configuration Item ${key} Has Been Changed To:\n\`${value}\``);
  }
  
    if(command === "showconf") {
    const configKeys = "";
    Object.keys(guildConf).forEach(key => {
      configKeys += `${key}  :  ${guildConf[key]}\n`;
    });
    message.channel.send(`The Following Are The Server's Current Configuration: \`\`\`${configKeys}\`\`\``);
  }
});

client.login(process.env.TOKEN)
