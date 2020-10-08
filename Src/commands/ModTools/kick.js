const BaseCommand = require("../../utils/structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");

module.exports = class KickCommand extends BaseCommand {
  constructor() {
    super(
      'kick', //name
      'ModTools', //category
      ['expulsar'], //aliases
      'kick <mencione um usuário>', //usage
      'Expulsa o usuário mencionado do servidor' //description
    );
  }

  async run(client, message, args) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.channel.send("Você não tem permissão para utilizar este comando");
    } else {
      try {
        const Mention = message.mentions.members.first() 
          || message.guild.members.cache.get(args[0]) 
          || message.guild.members.cache.find(x => x.user.username.toLowerCase() === args.slice(0).join(" ") 
          || x.user.username === args[0]);
        const target = message.guild.members.cache.get(Mention.id);
        if(!Mention) {
          message.channel.send("Mencione quem você quer expulsar");
        } else {
          target.kick()
            //.then(console.log("Expulso"))
            //.catch(console.error);
          message.channel.send(`${Mention.tag} foi expulso(a) do servidor`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
