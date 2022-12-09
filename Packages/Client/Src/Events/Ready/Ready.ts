import NDBClient from "@Client/NDBClient";
import { BaseEvent } from "@Utils/Structures";
import { EventOptions } from "~/Types";
import { Config } from "~/Config/Config";
import { MessageTools } from "~/Utils/Tools";
import { NDC } from "@Database/Schemas";
import { EmbedBuilder } from "discord.js";

export default class Event extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ready",
      type: "once",
      emitter: "client",
      enable: true,
    };

    super(client, options);
  }

  async run(client: NDBClient) {
    //* Logs
    await client.Tools.WAIT(2000);
    client.logger.event(`${client.Collections.events.size} Events`);
    client.logger.command(
      `${client.Collections.commands.size} Message Commands`
    );
    client.logger.command(
      `${client.Collections.SlashCommands.size} (/) Slash Commands`
    );
    client.logger.command(
      `${client.Collections.SubCommands.size} (/) Sub Slash Commands`
    );

    const ReadyMSG = await MessageTools.send(
      client.users.cache.get(Config.Owners[0]),
      {
        embeds: [
          new EmbedBuilder()
            .setTitle("Estou Online")
            .addFields([
              {
                name: "Online em",
                value: String(client.readyAt),
              },
            ])
            .setColor("#00c26f")
            .setTimestamp(),
        ],
      }
    );
    await client.Tools.WAIT(5000);
    MessageTools.delete(ReadyMSG);

    const FindNDC = await NDC.findOne({ Auth: process.env.AuthNDC });
    if (!FindNDC) {
      await new NDC({
        Auth: process.env.AuthNDC,
      }).save();
      client.logger.database(`NedcloarBR Community Database Updated`);
    }
  }
}
