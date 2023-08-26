import NDBClient from "@/Core/NDBClient";
import MusicTools from "@/Modules/Music/Utils/Tools";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { GuildMember } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "guildMemberRemove",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, member: GuildMember) {
    if (member.id === client.user.id) {
      const guildData = await client.database.GuildRepo.get(member.guild.id);
      const { Premium } = guildData.Settings;

      await (
        await MusicTools.getPlayer(client, member.guild.id, Premium)
      ).destroy();
      await client.database.GuildRepo.delete(member.guild);
    }
  }
}
