const Discord = require("discord.js");
const config = require("./config.json");
const parser = require('discord-command-parser');
const com = require("./commands/command");

const client = new Discord.Client();

client.once('ready',()=>{
  console.log('ready');
})

const prefix = "cov";

client.on('message',message=>{
  
  const parsed = parser.parse(message, prefix,{allowSpaceBeforeCommand:true});
  if(parsed.success){
    try{
      com[parsed.command](message,parsed.arguments);
      console.log(parsed.arguments);
    } catch(err){
      message.author.send("Perintah yang anda masukan salah");
    }
    
  }
});

client.login(config.BOT_TOKEN);