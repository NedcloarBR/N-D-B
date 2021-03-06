
//! This is the old Bot Info Command Disabled!



const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
const { version: djversion } = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const GuildConfig = require("../../Database/Schema/GuildConfig");

const { version } = require("../../../package.json");
const utc = require("moment");
const os = require("os");
const ms = require("ms");

module.exports = class BotInfoCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: 'botinfo',
      category: 'ℹ Info',
      aliases: [''],
      usage: '',
      description: 'Mostra as informações do Bot',
      disable: true
    });
  }

  async run(client, message, args) {
    const guildConfig = await GuildConfig.findOne({
      guildId: message.guild.id
    });
    const FindPrefix = guildConfig.prefix;

    let description = [
      `**❯ <:github:761642337448755202> ** [Clique na Estrela!]` + `(${"https://github.com/NedcloarBR/N-D-B"})`,
      `**❯ <:discord:739591596248530985> ** [Junte-se ao Server do meu Dev!]` + `(${"https://discord.gg/mMapzad"})`,
      `**❯ <:topgg:761642656626769930> ** [Vote no Top.gg]` + `(https://top.gg/bot/708822043420000366)`,
      `**❯ <:discord:739591596248530985> ** [Me Adicione ao seu Server!]` + `(${"https://discord.com/oauth2/authorize?client_id=708822043420000366&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fapi%2Fauth%2Fredirect&scope=bot%20applications.commands"})`,

      `**❯ Lista de Comandos: **` + `\`${FindPrefix}help || helpp\``
    ]

    const core = os.cpus()[0]
    const embed = new Discord.MessageEmbed()
        .setTitle("Informações do Bot")
        .setThumbnail(client.user.displayAvatarURL())
        .setColor("#00c26f")
        .addField("Geral", [
          `**❯ Client:**` + `${client.user.tag} (${client.user.id})`,
          `**❯ Comandos:**` + ` ${client.commands.size}`,
          `**❯ Servidores:**` + ` ${client.guilds.cache.size.toLocaleString()}`,
          `**❯ Usuários:**` + ` ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
          `**❯ Canais:**` + ` ${client.channels.cache.size.toLocaleString()}`,
          `**❯ Criado em:**` + ` ${utc(client.user.createdTimestamp).format("DD/MM/YYYY HH:mm:ss")}`,
          `**❯ Node.JS:**` + ` ${process.version}`,
          `**❯ Discord.JS:**` + ` v${djversion}`,
          `**❯ Bot Version:**` + ` v${version}`,
            "\u200b"
        ])
        .addField("Informações do Sistema", [
          `**❯ Tamanho do Projeto:**` + ` 312MB`,
          `**❯ Plataforma:**` + ` ${process.platform}`,
          //`**❯ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
          `**❯ CPU:**`,
          `\u3000 Cores:` + ` ${os.cpus().length}`,
          `\u3000 Modelo:` + ` ${core.model}`,
          `\u3000 Velocidade:` + ` ${core.speed}MHz`,
          `**❯ Memoria:**`,
          `\u3000 Total: ` + `${client.Tools.formatBytes(process.memoryUsage().heapTotal)}`,
          `\u3000 Usado: ` + `${client.Tools.formatBytes(process.memoryUsage().heapUsed)}`,
        ])
        .setDescription(description)
        .setTimestamp();
    message.channel.send(embed);
  }
}