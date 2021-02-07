const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require('../../Database/Schemas/GuildConfig');
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = class ChangePrefixCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setprefix',
      category: 'Moderation',
      aliases: ['definirprefix', 'definirprefixo', 'alterarprefix', 'alterarprefixo', 'changeprefix'],
      usage: 'setprefix <Novo Prefix>',
      description: 'Altera na DataBase o Prefix do server'
    });
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
      const guildConfig = await GuildConfig.findOne({
        guildId: message.guild.id
      })
      const SintaxErrEmbed = new Discord.MessageEmbed()
        .setTitle("❌ | Erro de Sintaxe")
        .setColor("RANDOM")
        .setDescription("Utilize: "+guildConfig.prefix+"setprefix <Novo Prefix>")
        .setTimestamp();
      if(!args[0]) return message.channel.send(SintaxErrEmbed)
      
      const newPrefixEmbed = new Discord.MessageEmbed()
        .setTitle("✔ | Prefix atualizado!")
        .setColor("RANDOM")
        .setDescription("Novo prefix: " + args[0])
        .setTimestamp();
      guildConfig.prefix = args[0]
      guildConfig.save()
      message.channel.send(newPrefixEmbed)

    } else {
      message.channel.send("Você não tem permissão para utilizar este comando")
    }
  }
}