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
      com[parsed.command](message,parsed.arguments);
      console.log(parsed.arguments);
  }
})

// const prefix = "!";

// function getToday(){
//   let today = new Date();
//   let months = [`January`,`February`,`March`,`April`,`May`,`June`,`July`,`August`,`September`,`October`,`November`,`December`];
//   let suffix = [`st`,`nd`,`rd`];
//   return `${today.getDate()}${suffix[today.getDate()] || `th`} of ${months[today.getMonth()]}`;
// }

// var i;
// client.on("message", function(message) {
//   if (message.author.bot) return;
//   if (!message.content.startsWith(prefix)) return;

//   const commandBody = message.content.slice(prefix.length);
//   const args = commandBody.split(' ');
//   const command = args.shift().toLowerCase();

//   if (command === "ping") {
//     const timeTaken = Date.now() - message.createdTimestamp;
//     const day = getToday();
//     //to send without mentioning 
//     message.channel.send(`Pong! This message had a latency of ${timeTaken}ms & Today ${day}.`);
//   }

//   else if (command === "sum") {
//     const numArgs = args.map(x => parseFloat(x));
//     const sum = numArgs.reduce((counter, x) => counter += x);
//     message.reply(`The sum of all the arguments you provided is ${sum}!`);
//   }

//   else if(command === "morning"){
//       message.reply('```صباح الخير \nguten morgen \nお早うございます \n안녕하십니까 \nДоброе утро \nสวัสดีครับ/ค่ะ \nselamat pagi```')
//   }
  
//   else if (command === "wenny"){
//     for(i = 0;i<3;i++){
//       message.channel.send("HALLO WENNY, SEMANGAT SKRIPISIAN DAN MAGANGNYA HEHEHEHE :heart: :heart: :heart: :heart: :heart: :heart: :heart: ")
//     }
//   }

//   else if (command === "2"){
//     message.channel.send("CIEE CIEE TANGGAL 2 HAHAHAH JADIAN NIH YEEEE HAHAHAHAH")
// }

// else if (command === "farrel"){
//   message.channel.send("HALLO FARREL, SEMANGAT KULIAHNYA JANGAN TIDUR MULU")
// }

// else if (command === "avatar"){
//   message.reply(message.author.displayAvatarURL());
// }

// console.log(message);

// });



client.login(config.BOT_TOKEN);