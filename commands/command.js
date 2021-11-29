const Discord = require('discord.js');
const api = require('novelcovid');
const abis = require('./soal.json');

const newEmbed = (options,embed)=> new Discord.MessageEmbed(embed)
	.setColor(options.color||'')
    .setTitle(options.title||'')
    .setURL(options.url)
	.setAuthor(options.author&&options.author.name||'', options.author&&options.author.url||'')
	.setDescription(options.description||'')
    .setThumbnail(options.thumbnail||'')
    .attachFiles(options.files || [])
	.addFields(options.fields||[])
	.setImage(options.image||'')
	.setTimestamp()
    .setFooter(options.footer||'');



const help =async (message,arguments)=>{
    //show all commands
    const embed = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : "this is the help section",
        title:"Perintah yang disediakan TanSelamat",
        fields:[
            {name :'Help', value:'`cov help`\n Memperlihatkan Perintah yang tersedia',inline : true},
            {name :'All', value:'`cov all`\n Memperlihatkan status Covid secara keseluruhan',inline : true},
            {name :'Country', value:'`cov country {country}`\n Memperlihatkan status covid berdasarkan negara',inline : true},
            {name :'rankings', value:'`cov ranks`\n Memperlihatkan urutan negara dengann status covid tertinggi',inline : true},
            {name :'Country Compare', value:'`cov compare {country} {country}`\n Membandingkan status covid pada 2 negara',inline : true},
            {name: 'Reminnder', value: '`cov remind {time} {reason}`\n Give a reminder with a reason', inline: true},
            {name: 'Diagnose', value: '`cov diagnose`\n Memberikan pertanyaan pada obrolan pribadi', inline: true}
        ], 
    })
    await message.channel.send(embed);
}

async function all(message){
    const data = await api.all();
    const prevdata = await api.yesterday.all();
    data.todayActive = data.active - prevdata.active;
    data.todayrec = data.recovered - prevdata.recovered;
    data.totalcritical = data.critical - prevdata.critical;
    data.todayTests = data.tests - prevdata.tests;
    const embed = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : "this is the help section",
        title:"Global data",
        fields:[
            {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
            {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
            {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
            {name :'Recovered', value:`${data.recovered}\n${(data.todayrec>=0?'+':'-')+String(Math.abs(data.todayrec))}`,inline : true},
            {name :'Critical', value:`${data.critical}\n${(data.totalcritical>=0?'+':'-')+String(Math.abs(data.totalcritical))}`,inline : true},
            {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
            {name :'Population', value:`${data.population}`,inline : true},
            {name :'Infection Rate', value:`${(data.casesPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'Fatality Rate', value:`${(data.deaths/data.cases*100).toFixed(3)}%`,inline : true},
            {name :'Critical Rate', value:`${(data.critical/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Recovery Rate', value:`${(data.recovered/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'infected countries', value:data.affectedCountries ,inline : true},
        ], 
    })
    await message.channel.send(embed);
}

async function remind(message, args){
    let timeuser = args[0];
    let reason = args.slice(1).join("")
    if(!timeuser) return await message.channel.send("Give time and whats the reason for the reminder");
    if(!reason) return await message.channel.send("Remember to give a reason for reminder");
}
// {name: 'Pertanyaan 2', value: "Apakah Anda memiliki riwayat mengidap penyakit di bawah ini?\n\na. Diabetes\n  b. Penyakit Jantung\n  c. Hipertensi\n  d. Keganasan\n  e. Gangguan Imunologi\n  f. Penyakit Ginjal Kronis\n  g. PPOK\n  H. Asma", inline: true},
//             {name: 'Pertanyaan 3', value: 'Sejak 14 hari yang lalu, apakah Anda memiliki kontak erat dengan kasus suspek COVID-19?', inline: true},
//             {name: 'Pertanyaan 4', value: 'Sejak 14 hari yang lalu, apakah Anda memiliki kontak erat dengan kasus konfirmasi COVID-19?', inline: true},
//             {name: 'Pertanyaan 5', value: 'Sejak 14 hari yang lalu, apakah Anda pernah mengunjungi pasar hewan?', inline: true},
//             {name: 'Pertanyaan 6', value: 'Sejak 14 hari yang lalu, apakah Anda pernah mengunjungi tempat publik?', inline: true},
//             {name: 'Pertanyaan 7', value: 'Sejak 14 hari yang lalu, apakah Anda pernah mengunjungi fasilitas kesehatan?', inline: true},
//             {name: 'Pertanyaan 8', value: 'Apakah Anda termasuk kelompok Infeksi Saluran Pernapasan Berat (ISPB) sehingga membutuhkan perawatan di Rumah Sakit?', inline: true},
//             {name: 'Pertanyaan 9', value: 'Apakah Anda mengalami gejala demam?', inline: true},
//             {name: 'Pertanyaan 10', value: 'Apakah Anda mengalami gejala batuk?', inline: true},
//             {name: 'Pertanyaan 11', value: 'Apakah Anda mengalami gejala pilek?', inline: true},
//             {name: 'Pertanyaan 12', value: 'Apakah Anda sedang mengalami sakit tenggorokan?', inline: true},
//             {name: 'Pertanyaan 13', value: 'Apakah Anda sedang mengalami sesak nafas?', inline: true},
//             {name: 'Pertanyaan 14', value: 'Apakah Anda merasa menggigil?', inline: true},
//             {name: 'Pertanyaan 15', value: 'Apakah Anda mengalami sakit kepala?', inline: true},
//             {name: 'Pertanyaan 16', value: 'Apakah Anda merasa lemah dan lesu?', inline: true},
//             {name: 'Pertanyaan 17', value: 'Apakah Anda merasa nyeri otot?', inline: true},
//             {name: 'Pertanyaan 18', value: 'Apakah Anda sedang mengalami gejala mual/muntah?', inline: true},
//             {name: 'Pertanyaan 19', value: 'Apakah Anda merasakan nyeri di abdomen atau perut?', inline: true},
//             {name: 'Pertanyaan 20', value: 'Apakah Anda sedang mengalami diare?', inline: true},

async function diagnose(message, args){
    const data = abis.pertanyaan;
    var input=[];
    var stop = 0;
    const timer = ms => new Promise(res => setTimeout(res, ms))
    const filter =(m) => m.author.id === message.author.id;
    const collector = new Discord.MessageCollector(message.channel, filter);
    console.log(data)

    collector.on("collect", (msg)=> {
        console.log(msg.content);
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
    });

    for(var i = 0; i<data.length; i++){
        if(stop == 1){
            break;
        } else {
            const embed = newEmbed({
                color:'#dc3147',
                author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
                description : `Jawablah pertanyaan di bawah ini dengan Tidak, Tidak tahu, Mungkin, Kemungkinan besar, Iya `,
                title:`Diagnosa Mandiri`,
                fields:[
                    {name :`Pertanyaan ${data[i].no}`, value:`${data[i].soal}`,inline : true}
                ]
            })
    
            message.author.send(embed).then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                  })
                  .then(message => {
                    message = message.first()
                    if (message.content.toUpperCase() == 'IYA' || message.content.toUpperCase() == 'Y') {
                        message.channel.send(`Sebelumnya Anda menjawab iya`);
                        input.push(Number(1.0));
                    } else if (message.content.toUpperCase() == 'HAMPIR PASTI' || message.content.toUpperCase() == 'HP') {
                        message.channel.send(`Sebelumnya Anda menjawab hampir pasti`);
                        input.push(Number(0.75));
                    } else if (message.content.toUpperCase() == 'KEMUNGKINAN BESAR' || message.content.toUpperCase() == 'KB') {
                        message.channel.send(`Sebelumnya Anda menjawab kemungkinan besar`);
                        input.push(Number(0.5));
                    } else if (message.content.toUpperCase() == 'MUNGKIN' || message.content.toUpperCase() == 'M') {
                        message.channel.send(`Sebelumnya Anda menjawab mungkin`);
                        input.push(Number(0.25));
                    } else if (message.content.toUpperCase() == 'TIDAK TAHU' || message.content.toUpperCase() == 'TT') {
                        message.channel.send(`Sebelumnya Anda menjawab tidak tahu`);
                        input.push(Number(0.0));
                    } else if (message.content.toUpperCase() == 'TIDAK' || message.content.toUpperCase() == 'T') {
                        message.channel.send(`Sebelumnya Anda menjawab tidak`);
                        input.push(Number(0.0));
                    } else if (message.content.toUpperCase() == 'MEMILIH TIDAK MENGATAKAN' || message.content.toUpperCase() == 'MTM') {
                        message.channel.send(`Sebelumnya Anda tidak ingin mengatakan`);
                        input.push(Number(0.0));
                    } else {
                        message.channel.send(`Masukan yang diberikan salah, mohon baca keterangan menjawab`);
                        stop = 1;
                    }
                  })
                  .catch(collected => {
                      message.channel.send('Timeout');
                      stop = 1;
                  });
              });
        }
        

        await timer(11000);
    }
    
    collector.stop();
    console.log(input);
    rule1(message, input);
}

function rule1(message, input){
    console.log('masuk kesini');
    console.log(input[0]);
    console.log(input.length);
    var hasil = 0.0;
    for(var j = 0; j<input.length; j++){
        if (j == 0){
            hasil = input[j] * 0.4;
            console.log("masuk j = 0");
            console.log(hasil);
            continue;
        } else if(j == 1){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 1");
            console.log(hasil);
            continue;
        } else if(j == 2){
            hasil = hasil + (input[j] * 0.6) * (1-hasil);
            console.log("masuk j = 2");
            console.log(hasil);
            continue;
        } else if(j == 3){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 3");
            console.log(hasil);
            continue;
        } else if(j == 4){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 4");
            console.log(hasil);
            continue;
        } else if(j == 5){
            hasi = hasil + (input[j] * 1) * (1-hasil);
            console.log("masuk j = 5");
            console.log(hasil);
            continue;
        } else if(j == 6){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 6");
            console.log(hasil);
            continue;
        } else if(j == 7){
            hasil = hasil + (input[j] * 1) * (1-hasil);
            console.log("masuk j = 7");
            console.log(hasil);
            continue;
        } else if(j == 8){
            hasil = hasil + (input[j] * 0.6) * (1-hasil);
            console.log("masuk j = 8");
            console.log(hasil);
            continue;
        } else if(j == 9){
            hasil = hasil + (input[j] * 0.6) * (1-hasil);
            console.log("masuk j = 9");
            console.log(hasil);
            continue;
        } else if(j == 10){
            hasil = hasil + (input[j] * 0.2) * (1-hasil);
            console.log("masuk j = 10");
            console.log(hasil);
            continue;
        } else if(j == 11){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 11");
            console.log(hasil);
            continue;
        } else if(j == 12){
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 12");
            console.log(hasil);
            continue;
        } else if(j == 13){
            hasil = hasil + (input[j] * 0.2) * (1-hasil);
            console.log("masuk j = 13");
            console.log(hasil);
            continue;
        } else if(j == 14){
            hasil = hasil + (input[j] * 1) * (1-hasil);
            console.log("masuk j = 14");
            console.log(hasil);
            continue;
        } else {
            hasil = hasil + (input[j] * 0.8) * (1-hasil);
            console.log("masuk j = 15");
            console.log(hasil);
            break;
        } 
    }
    hasil.toFixed(3);
    console.log("Tembus yak");
    console.log(hasil);
    const embed = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : `Berdasarkan Rule 1\n${hasil} sehingga memiliki kemungkinan positif ${hasil*100}%`,
        title:`Hasil diagnosa mandiri"`
    })
    message.author.send(embed);
}

async function country(message,args){

    if(args.length<1) return await message.channel.send("give some country name"); 
    const data = await api.countries({country : args.join(' ') });
    const prevdata = await api.yesterday.countries({country : args.join(' ')});
    const str = args[0];
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    data.todayActive = data.active - prevdata.active;
    data.todayrec = data.recovered - prevdata.recovered;
    data.totalcritical = data.critical - prevdata.critical;
    data.todayTests = data.tests - prevdata.tests;
    const embed = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : `Data COVID19 Berdasarkan Negara ${str2}`,
        title:`Data negara ${str2}`,
        fields:[
            {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
            {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
            {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
            {name :'Recovered', value:`${data.recovered}\n${(data.todayrec>=0?'+':'-')+String(Math.abs(data.todayrec))}`,inline : true},
            {name :'Critical', value:`${data.critical}\n${(data.totalcritical>=0?'+':'-')+String(Math.abs(data.totalcritical))}`,inline : true},
            {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
            {name :'Population', value:`${data.population}`,inline : true},
            {name :'Infection Rate', value:`${(data.casesPerOneMillion/10000).toFixed(3)}%`,inline : true},
            {name :'Fatality Rate', value:`${(data.deaths/data.cases*100).toFixed(3)}%`,inline : true},
            {name :'Critical Rate', value:`${(data.critical/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Recovery Rate', value:`${(data.recovered/data.active*100).toFixed(3)}%`,inline : true},
            {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
        ],
         
    })
    await message.channel.send(embed);
}

// async function state(message,args){
//     if(args.length<1) return await message.channel.send("give a state name");
//     //same as country but the data will be of a state
//     const data = await api.states({state : args.join(' ') });
//     const prevdata = await api.yesterday.states({state : args.join(' ')});
//     data.todayActive = data.active - prevdata.active;
//     data.todayrec = data.recovered - prevdata.recovered;
//     data.totalcritical = data.critical - prevdata.critical;
//     data.todayTests = data.tests - prevdata.tests;
//     //everything is same except this time the data is of a country
//     const embed = newEmbed({
//         color:'#dc3147',
//         author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
//         description : "this is the help section",
//         title:"Global data",
//         fields:[
//             {name :'cases', value:`${data.cases}\n${(data.todayCases>=0?'+':'-')+String(Math.abs(data.todayCases))}`,inline : true},
//             {name :'deaths', value:`${data.deaths}\n${(data.todayDeaths>=0?'+':'-')+String(Math.abs(data.todayDeaths))}`,inline : true},
//             {name :'Active', value:`${data.active}\n${(data.todayActive>=0?'+':'-')+String(Math.abs(data.todayActive))}`,inline : true},
//             {name :'Tests', value:`${data.tests}\n${(data.todayTests>=0?'+':'-')+String(Math.abs(data.todayTests))}`,inline : true},
//             {name :'Test Rate', value:`${(data.testsPerOneMillion/10000).toFixed(3)}%`,inline : true},
//         ],
//          
//     })
//     await message.channel.send(embed);

// }

async function ranks(message,args){
    const data = await api.all();
    const countries = (await api.countries({sort:'cases'})).splice(0,10);
    var countrylist =[];
    countries.forEach(c => {
        countrylist.push({
            name : c.country,
            value : c.cases
        })
    });
    const embed =newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : "this is the help section",
        title:"Top 15 countries sorted by cases",
        fields:countrylist,
    })
    await message.channel.send(embed);
}

async function compare(message,args){
    if(args.length<2) return await message.channel.send("please privide two countries");
    args = args.splice(0, 2)
    const yesterday = await api.yesterday.countries({ country: args})
  let data = await api.countries({ country: args })
  if (data.find(c => c.message)) 
    return await message.channel.send(data.map(c => c.message).filter(x => x))
  data = data.map((country, i) => ({
    ...country,
    todayActives: country.active - yesterday[i].active,
    todayRecovereds: country.recovered - yesterday[i].recovered,
    todayCriticals: country.critical - yesterday[i].critical,
    todayTests: country.tests - yesterday[i].tests,
  }))
  const embed = newEmbed({
    color:'#dc3147',
    author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
    title: `Comparison between ${data[0].country} & ${data[1].country}`,
    fields: [
      { name: 'Cases', value: `**${data[0].country}**: ${(data[0].cases)} (${(data[0].todayCases >= 0 ? "+":"-")+String(Math.abs(data[0].todayCases))})\n**${data[1].country}**: ${(data[1].cases)} (${(data[1].todayCases >= 0 ? "+":"-")+String(Math.abs(data[1].todayCases))})`, inline: true },
      { name: 'Deaths', value: `**${data[0].country}**: ${(data[0].deaths)} (${(data[0].todayDeaths >= 0 ? "+":"-")+String(Math.abs(data[0].todayDeaths))})\n**${data[1].country}**: ${(data[1].deaths)} (${(data[1].todayDeaths >= 0 ? "+":"-")+String(Math.abs(data[1].todayDeaths))})`, inline: true },
      { name: 'Active', value: `**${data[0].country}**: ${(data[0].active)} (${(data[0].todayActives >= 0 ? "+":"-")+String(Math.abs(data[0].todayActives))})\n**${data[1].country}**: ${(data[1].active)} (${(data[1].todayActives >= 0 ? "+":"-")+String(Math.abs(data[1].todayActives))})`, inline: true },
      { name: 'Recovered', value: `**${data[0].country}**: ${(data[0].recovered)} (${(data[0].todayRecovereds >= 0 ? "+":"-")+String(Math.abs(data[0].todayRecovereds))})\n**${data[1].country}**: ${(data[1].recovered)} (${(data[1].todayRecovereds >= 0 ? "+":"-")+String(Math.abs(data[1].todayRecovereds))})`, inline: true },
      { name: 'Critical', value: `**${data[0].country}**: ${(data[0].critical)} (${(data[0].todayCriticals >= 0 ? "+":"-")+String(Math.abs(data[0].todayCriticals))})\n**${data[1].country}**: ${(data[1].critical)} (${(data[1].todayCriticals >= 0 ? "+":"-")+String(Math.abs(data[1].todayCriticals))})`, inline: true },
      { name: 'Tests', value: `**${data[0].country}**: ${(data[0].tests)} (${(data[0].todayTests >= 0 ? "+":"-")+String(Math.abs(data[0].todayTests))})\n**${data[1].country}**: ${(data[1].tests)} (${(data[1].todayTests >= 0 ? "+":"-")+String(Math.abs(data[1].todayTests))})`, inline: true },
      { name: 'Population', value: `**${data[0].country}**: ${(data[0].population)}\n**${data[1].country}**: ${(data[1].population)}`, inline: true },
      { name: 'Infection Rate', value: `**${data[0].country}**: ${(data[0].casesPerOneMillion/10000).toFixed(4)} %\n**${data[1].country}**: ${(data[1].casesPerOneMillion/10000).toFixed(4)} %`, inline: true },
      { name: 'Fatality Rate', value: `**${data[0].country}**: ${(data[0].deaths/data[0].cases*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].deaths/data[1].cases*100).toFixed(4)} %`, inline: true },
      { name: 'Critical Rate', value: `**${data[0].country}**: ${(data[0].critical/data[0].active*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].critical/data[1].active*100).toFixed(4)} %`, inline: true },
      { name: 'Recovery Rate', value: `**${data[0].country}**: ${(data[0].recovered/data[0].cases*100).toFixed(4)} %\n**${data[1].country}**: ${(data[1].recovered/data[1].cases*100).toFixed(4)} %`, inline: true },
      { name: 'Test Rate', value: `**${data[0].country}**: ${(data[0].testsPerOneMillion/10000).toFixed(4)} %\n**${data[1].country}**: ${(data[1].testsPerOneMillion/10000).toFixed(4)} %`, inline: true },
    ],
  })
  await message.channel.send(embed)

    
}

//CHARTS <3
const config = ChartJS=>{
    ChartJS.defaults.global.defaultFontColor='#fff'
    ChartJS.defaults.global.defaultFontStyle='bold'
    ChartJS.defaults.global.defaultFontFamily='Helvetica Neue, Helvetica, Arial, sans-serif'
    ChartJS.plugins.register({
        beforInit:function(chart){
            chart.legend.afterFit = function() {this.height +=35}
        },
        beforeDraw:(chart)=>{
            const ctx = chart.ctx;
            ctx.save();
            ctx.fillStyle = '#2f3136';
            ctx.fillRect(0,0,chart.width,chart.height);
            ctx.restore();
        }
    })
}

async function overview(message,args){
    if(args.length<1) return await message.channel.send("specify a country name");
    const pieData = ['global','all'].includes(args[0].toLowerCase())? await api.all() : await api.countries({country:args[0]});
    const buffer = await lineRenderer.renderToBuffer({
        type:'pie',
        data: {
            labels:['Active','Recovered','Deaths'],
            datasets: [{
                data: [pieData.active,pieData.recovered,pieData.deaths],
                backgroundColor: ['#fecb89', '#a7d129', '#e14594'],
                borderWidth:1,
                borderColor: ['#fecb89', '#a7d129', '#e14594']
            }],
        },
        options : {
            legend: {
                display: true,
                labels:{
                    padding: 40,
                    fontSize: 30,
                }
            }
        } 
    })

    const embed = newEmbed({
        color: '#303136',
        author:{name : "Covid stats", url: 'https://cdn.discordapp.com/icons/707227171835609108/f308f34a45ac7644506fb628215a3793.png?size=128' },
        title: `${pieData.country||'Global'} Overview`,
        files: [new Discord.MessageAttachment(buffer,'graph.png')],
        image: 'attachment://graph.png',
    })

    await message.channel.send(embed);
}

module.exports = {
    help,
    h : help,
    all,
    a:all,
    country,
    c: country,
    ranks,
    r:ranks,
    compare,
    comp : compare,
    remind,
    r: remind,
    diagnose,
    d: diagnose
}