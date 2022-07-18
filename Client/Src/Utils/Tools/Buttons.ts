import NDBClient from "@Client/NDBClient";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  Message,
} from "discord.js";

export default class Buttons {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async Confirm(
    msgint: Message | CommandInteraction
  ): Promise<ActionRowBuilder> {
    return new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("YES")
        .setLabel(
          await this.client.translate(
            "Tools/Buttons:Labels:Confirm:YES",
            msgint
          )
        )
        .setEmoji("719710630881525881")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("NO")
        .setLabel(
          await this.client.translate("Tools/Buttons:Labels:Confirm:NO", msgint)
        )
        .setEmoji("719710607405875321")
        .setStyle(ButtonStyle.Success),
    ]);
  }

  async Pages(
    msgint: Message | CommandInteraction,
    CurrentPage: number,
    EmbedsLength: number
  ): Promise<ActionRowBuilder> {
    return new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId("PREVIOUS")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(CurrentPage <= 1),
      new ButtonBuilder()
        .setCustomId("NEXT")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("➡️")
        .setDisabled(!(CurrentPage < EmbedsLength)),
    ]);
  }
}
