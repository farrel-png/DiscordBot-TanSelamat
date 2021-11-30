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
        description : "Perintah yang tersedia",
        title:"ChatBot TanSelamat",
        fields:[
            {name :'Help', value:'`cov help`\n Memperlihatkan perintah yang tersedia',inline : true},
            {name :'All', value:'`cov all`\n Memperlihatkan status Covid secara keseluruhan',inline : true},
            {name :'Country', value:'`cov country {country}`\n Memperlihatkan status covid berdasarkan negara',inline : true},
            {name :'rankings', value:'`cov ranks`\n Memperlihatkan urutan negara dengann status covid tertinggi',inline : true},
            {name :'Country Compare', value:'`cov compare {country} {country}`\n Membandingkan status covid pada 2 negara',inline : true},
            {name: 'Diagnose', value: '`cov diagnose`\n Melakukan diagnosis mandiri pada obrolan pribadi', inline: true}
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
        description : "Berdasarkan Disease.sh - Open Disease Data API",
        title:"Data Covid19 di Dunia",
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
        url:'https://disease.sh'
    })
    await message.channel.send(embed);
}


//Diagnose
async function diagnose(message, args){
    const data = abis.pertanyaan;
    var input=[];
    var stop = 0;
    const timer = ms => new Promise(res => setTimeout(res, ms))
    const filter =(m) => m.author.id === message.author.id;
    const collector = new Discord.MessageCollector(message.channel, filter);
    const embed = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        description : `Anda diberikan **waktu 30 detik** untuk bersiap sebelum menjawab pertanyaan dan membaca deskripsi ini
        \nDi setiap pertanyaan anda diberikan **waktu 10 detik untuk menjawab,** anda bisa menjawab dengan **"tidak"**, **"mungkin"**, 
        **"kemungkinan besar"**, **"hampir pasti"**
         dan **"iya"**
        \n Anda juga diperkenankan untuk menjawab dengan **"tidak tahu"**
        \nJika anda memasukan input yang tidak sesuai, maka diagnosa mandiri akan berhenti dan akan tetap memberikan hasil berdasarkan pertanyaan yang sudah Anda
        jawab. 
        \nAnda disarankan untuk mengulangi kembali diagnosa mandiri agar diagnosa mandiri berjalan sepenuhnya`,
        title:`Diagnosa Mandiri`
    })

    message.author.send(embed);
    await timer(35000);

    const start = newEmbed({
        color:'#dc3147',
        author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
        title:"Diagnosa Mandiri akan dimulai"
    })
    message.author.send(start);
    await timer(3000);

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
                    time: 5000,
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
        

        await timer(6000);
    }
    
    collector.stop();
    console.log(input);
    rule1(message, input);
}
//Certainty Factor
function rule1(message, input){
    console.log('masuk kesini');
    console.log(input[0]);
    console.log(input.length);
    var hasil = 0.0;
    for(var j = 0; j<input.length; j++){
        if (j == 0){
            console.log(hasil)
            hasil = input[j] * 0.4;
            console.log("masuk j = 0");
            console.log(hasil);
            continue;
        } else if(j == 1){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 1");
            console.log(hasil);
            continue;
        } else if(j == 2){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.6) * (1-hasil);
            console.log("masuk j = 2");
            console.log(hasil);
            continue;
        } else if(j == 3){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 3");
            console.log(hasil);
            continue;
        } else if(j == 4){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 4");
            console.log(hasil);
            continue;
        } else if(j == 5){
            console.log(hasil)
            hasil = hasil + (input[j] * 1.0) * (1-hasil);
            console.log("masuk j = 5");
            console.log(hasil);
            continue;
        } else if(j == 6){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 6");
            console.log(hasil);
            continue;
        } else if(j == 7){
            console.log(hasil)
            hasil = hasil + (input[j] * 1.0) * (1-hasil);
            console.log("masuk j = 7");
            console.log(hasil);
            continue;
        } else if(j == 8){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.6) * (1-hasil);
            console.log("masuk j = 8");
            console.log(hasil);
            continue;
        } else if(j == 9){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 9");
            console.log(hasil);
            continue;
        } else if(j == 10){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.2) * (1-hasil);
            console.log("masuk j = 10");
            console.log(hasil);
            continue;
        } else if(j == 11){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 11");
            console.log(hasil);
            continue;
        } else if(j == 12){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.4) * (1-hasil);
            console.log("masuk j = 12");
            console.log(hasil);
            continue;
        } else if(j == 13){
            console.log(hasil)
            hasil = hasil + (input[j] * 0.2) * (1-hasil);
            console.log("masuk j = 13");
            console.log(hasil);
            continue;
        } else if(j == 14){
            console.log(hasil)
            hasil = hasil + (input[j] * 1.0) * (1-hasil);
            console.log("masuk j = 14");
            console.log(hasil);
            continue;
        } else {
            console.log(hasil)
            hasil = hasil + (input[j] * 0.8) * (1-hasil);
            console.log("masuk j = 15");
            console.log(hasil);
            break;
        } 
    }
    hasil = hasil*100;
    hasil = hasil.toFixed(2);

    //Hasil Certainty Factor
    if(hasil<46){
        const embed = newEmbed({
            color:'#dc3147',
            author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
            description : `Anda **Negatif covid19** dengan persentase ${hasil}%. Tetaplah menjaga kesehatan Anda,
            rajinlah berolahraga, minum air putih 8 gelas per hari dan minum vitamin \n**Hasil yang diberikan bukan lah hasil diagnosa asli,
            disini hanya menghitung potensi atau kemungkinan dari hasil diagnosa anda\nTetap jaga kesehatan Salam TanSelamat**`,
            title:`Hasil diagnosa mandiri"`
        })
        message.author.send(embed);
    } else if(hasil<86){
        const embed = newEmbed({
            color:'#dc3147',
            author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
            description : `Anda **Berkemungkinan Besar COVID19** dengan persentase ${hasil}%. Tetaplah menjaga kesehatan Anda, rajin berolahraga
            dan juga meminum vitamin.\nJika gejala masih berlanjut sampai seminggu kedapan segera datang ke rumah sakit terdekat.
             \n**Hasil yang diberikan bukan lah hasil diagnosa asli, disini hanya menghitung potensi atau kemungkinan dari hasil diagnosa anda
             \nTetap jaga kesehatan Salam TanSelamat**`,
            title:`Hasil diagnosa mandiri"`
        })
        message.author.send(embed);
    }else{
        const embed = newEmbed({
            color:'#dc3147',
            author:{name : "TanSelamat", url: 'https://cdn.discordapp.com/attachments/878248882432262197/899666335200583710/tanSelamat1.png?size=600' },
            description : `Anda **POSITIF COVID19** dengan persentase ${hasil}%. Segera melakukan pengecekan lebih lanjut menggunakan metode PCR
             dan datang kerumah sakit terdekat jika gejala masih berlanjut.
             \n**Hasil yang diberikan bukan lah hasil diagnosa asli, disini hanya menghitung potensi atau kemungkinan dari hasil diagnosa anda
             \nTetap jaga kesehatan Salam TanSelamat**`,
            title:`Hasil diagnosa mandiri"`
        })
        message.author.send(embed);
    }
    console.log("Tembus yak");
    console.log(hasil);
}


//Country
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
        url:'https://disease.sh'
         
    })
    await message.channel.send(embed);
}


//ranks
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
        description : "Berdasarkan novelcovid",
        title:"Urutan 15 negara dengan kasus terbanyak",
        fields:countrylist,
        url:'https://disease.sh'
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
    title: `Perbandingan antara ${data[0].country} & ${data[1].country}`,
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
    url:'https://disease.sh'
  })
  await message.channel.send(embed)

    
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
    diagnose,
    d: diagnose
}