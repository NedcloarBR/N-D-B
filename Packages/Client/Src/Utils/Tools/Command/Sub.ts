import NDBClient from "@Client/NDBClient";
import { BaseSubCommand } from "@Utils/Structures";
import { InteractionTools } from "../index";
import { CommandInteraction, TextChannel } from "discord.js";
import { Document } from "mongoose";
import { Config } from "~/Config/Config";

export default class SubTools {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  public checkOwner(target: string) {
    return Config.Owners.includes(target);
  }

  public checkGuild(target: string) {
    return Config.ServerOnly.ID.includes(target);
  }

  public capitalize(string: string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  public removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  public resolveCommand(nameOrAlias: string) {
    return (
      this.client.Collections.commands.get(nameOrAlias) ??
      this.client.Collections.commands.get(
        this.client.Collections.aliases.get(nameOrAlias)!
      )
    );
  }

  public async runCheck(
    interaction: CommandInteraction,
    _Command: BaseSubCommand,
    UserProfile: Document
  ): Promise<boolean> {
    const Options = _Command.options;
    const Channel = interaction.channel as TextChannel;
    var NDCash = UserProfile.get("NDCash.NDCash");

    if (Options.ownerOnly && !this.checkOwner(interaction.user.id)) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:OwnerOnly",
          interaction
        )
      );
      return false;
    }

    if (Options.guildOnly && !this.checkGuild(interaction.guild.id)) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:GuildOnly",
          interaction
        )
      );
      return false;
    }
    if (Options.nsfw && !Channel.nsfw) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NSFW",
          interaction
        )
      );
      return false;
    }
    if (Options.disable) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:Disable",
          interaction
        )
      );
      return false;
    }
    if (Options.ndcash && !NDCash) {
      InteractionTools.reply(
        interaction,
        await this.client.Translate.Guild(
          "Tools/Command:Checker:NDCash",
          interaction
        )
      );
      return false;
    }
    if (Options.ndcash && NDCash) {
      NDCash -= Options.ndcash;
      UserProfile.save();
      return true;
    }

    return true;
  }
}
