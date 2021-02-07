const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class TestCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'editsnipe',
      category: 'Interacion',
      aliases: ['esnipe'],
      usage: '',
      description: 'Mostra a ultima mensagem editada no canal',
    });
  }

  async run(client, message, args) {
    //message.channel.send("Comando Desabilitado")
    const msg = client.editSnipe.get(message.channel.id)
    if(!msg) return message.channel.send("Nenhuma Mensagem editada")
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .addFields(
            // { name: "Messagem Antiga", value: msg.OldContent },
            // { name: "Messagem Editada", value: msg.NewContent }
            { name: "Messagem Editada", value: msg.OldContent }
        )
      .setColor("#00c26f")
      .setFooter("Mensagem Editada")
      .setTimestamp()
    if(msg.image)embed.setImage(msg.image)
    

    message.channel.send(embed)
  }
}

