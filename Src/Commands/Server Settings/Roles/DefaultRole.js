const BaseCommand = require("../../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const GuildConfig = require("../../../Database/Schemas/GuildConfig");
//const {} = require("../../../Config/Abbreviations.js");

mongoose.connect(process.env.DBC, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = class SetDefaultRoleCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'setrole',
      category: 'Server Settings',
      aliases: ['defaultrole'],
      usage: 'setrole <Id do Cargo>',
      description: 'Defini o Cargo padrão do servidor\nNecessário para o funcionamento do comando de lockdown'
    });
  }

  async run(client, message, args) {
    if(message.member.hasPermission("MANAGE_GUILD")) {
        const guildConfig = await GuildConfig.findOne({
          guildId: message.guild.id
        })
        const FindRole = guildConfig.defaultRole;
        const Role = message.guild.roles.cache.find(r => r.id === `${FindRole}`);
        const SintaxErrEmbed = new Discord.MessageEmbed()
          .setTitle("❌ | Erro de Sintaxe")
          .setColor("RANDOM")
          .setDescription("Utilize: "+guildConfig.prefix+"setrole <Cargo ID>")
          .setTimestamp();
        if(!args[0]) return message.channel.send(SintaxErrEmbed)
        
        guildConfig.defaultRole = args[0]
        guildConfig.save().catch((err) => console.log("SetRole Error: " + err))

        const SetRoleEmbed = new Discord.MessageEmbed()
          .setTitle("✔ | Cargo Definido!")
          .setColor("RANDOM")
          .setDescription("Cargo definido como: " + "<@&"+Role+">")
          .setTimestamp();
        message.channel.send(SetRoleEmbed)
  
      } else {
        message.channel.send("Você não tem permissão para utilizar este comando")
      }
  }
}