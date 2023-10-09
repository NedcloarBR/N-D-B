/* eslint-disable no-shadow */

import { Emojis } from "@/Config/Config";
import { Context } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import {
  EmbedBuilder,
  Message,
  TextChannel,
  channelMention,
  roleMention
} from "discord.js";
import { REACTION_OPTIONS, iReaction } from "./../Types/index.d";

export async function InvalidChannelEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.id,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:Channel:Invalid",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function InvalidIDEmbed(context: Context): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.id,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:ID:Invalid",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function MessageNotFoundEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.id,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:ID:NotFound",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function InvalidRoleEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.id,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:Role:Invalid",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function InvalidEmojiEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.id,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:Emoji:Invalid",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function ReactionRoleCreatedEmbed(
  context: Context,
  { Channel, Message, Role, Emoji, Option }: iReaction
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:Embed:Author",
        context
      ),
      iconURL: context.guild.iconURL()
    })
    .setColor("#00c26f")
    .addFields([
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:1",
          context
        ),
        value: channelMention(Channel),
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:2",
          context
        ),
        value: Emoji,
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:3",
          context
        ),
        value: String(Option),
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:4",
          context
        ),
        value: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:Content:4",
          context,
          {
            MsgIdURL: await (
              await MessageTools.get(
                (await context.guild.channels.fetch(Channel)) as TextChannel,
                Message
              )
            ).url
          }
        )
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/CreateReaction:Embed:Fields:5",
          context
        ),
        value: roleMention(Role)
      }
    ]);
}

export async function ReactionRoleRemovedEmbed(
  context: Context,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#00c26f")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/DeleteReaction:Removed",
        context,
        { success: Emojis.accept, URL: MsgID.url }
      )
    );
}

export async function ReactionRoleUpdatedEmbed(
  context: Context,
  { Channel, Message, Role, Emoji }: iReaction,
  newOption: REACTION_OPTIONS
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#00c26f")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/UpdateReaction:Embed:Description",
        context
      )
    )
    .addFields(
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:1",
          context
        ),
        value: channelMention(Channel),
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:2",
          context
        ),
        value: Emoji,
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:3",
          context
        ),
        value: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:Content:3",
          context,
          {
            MsgIdURL: (
              await (
                (await context.guild.channels.fetch(Channel)) as TextChannel
              ).messages.fetch(Message)
            ).url
          }
        ),
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:4",
          context
        ),
        value: roleMention(Role),
        inline: true
      },
      {
        name: await context.client.Translate.Guild(
          "ReactionRole/UpdateReaction:Embed:Fields:5",
          context
        ),
        value: newOption.toString(),
        inline: true
      }
    )

    .setFooter({
      text: await context.client.Translate.Guild(
        "ReactionRole/UpdateReaction:Embed:Footer",
        context
      )
    });
}

export async function ReactionRoleDeleteAllEmbed(
  context: Context,
  status: "Confirm" | "Cancel" | "Success",
  ReactionCount: number | null
): Promise<EmbedBuilder> {
  let description: string;
  let color;
  switch (status) {
    case "Confirm":
      description = "ReactionRole/DeleteAllReactions:Embed:Description:Confirm";
      color = "#00c26f";
      break;
    case "Cancel":
      description = "ReactionRole/DeleteAllReactions:Embed:Description:Cancel";
      color = "#c20e00";
      break;
    case "Success":
      description = "ReactionRole/DeleteAllReactions:Embed:Description:Success";
      color = "#00c26f";
      break;
  }
  return new EmbedBuilder()
    .setTitle(
      await context.client.Translate.Guild(
        "ReactionRole/DeleteAllReactions:Embed:Title",
        context
      )
    )
    .setAuthor({
      name: context.author.username,
      iconURL: context.author.displayAvatarURL()
    })
    .setDescription(
      await context.client.Translate.Guild(description, context, {
        NUMBER: ReactionCount
      })
    )
    .setColor(color);
}

//TODO: Fazer esse Embed ser mais bonito
export async function UnableToCreateReactionRoleEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/CreateReaction:UnableToCreate",
        context,
        { fail: Emojis.fail }
      )
    );
}

export async function UnableToDeleteReactionRoleEmbed(
  context: Context,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/DeleteReaction:UnableToDelete",
        context,
        { success: Emojis.accept, URL: MsgID.url }
      )
    );
}

export async function UnableToDeleteAllReactionRoleEmbed(
  context: Context
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/DeleteAllReaction:UnableToDelete",
        context
      )
    );
}

export async function UnableToUpdateReactionRoleEmbed(
  context: Context,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: context.author.tag,
      iconURL: context.author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await context.client.Translate.Guild(
        "ReactionRole/UpdateReaction:UnableToUpdate",
        context,
        { success: Emojis.accept, URL: MsgID.url }
      )
    );
}
