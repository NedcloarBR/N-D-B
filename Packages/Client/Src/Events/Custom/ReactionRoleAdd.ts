/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import NDBClient from "@/Core/NDBClient";
import { GuildRepository } from "@/Database/Repositories";
import ReactionRole from "@/Modules/ReactionRole";
import { EventOptions } from "@/Types";
import { BaseEvent } from "@/Utils/Structures";
import { MessageTools } from "@/Utils/Tools";
import { EmbedBuilder, MessageReaction, User } from "discord.js";

export default class ReactionRoleAddEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "ReactionRoleAdd",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(client: NDBClient, reaction: MessageReaction, user: User) {
    if (user === client.user) return;
    const react = new ReactionRole(client, "ReactionRoleAddEvent");
    const TIMER: number = 10 * 1000;
    const ReactionCooldown = new Set();
    const ClientCooldown = new Set();
    const data = await react.getAll(reaction.message.guild);
    const GuildData = await new GuildRepository().get(reaction.message.guild);
    const Guild = reaction.message.guild;
    const Member = Guild.members.cache.get(user.id);

    if (!data) return;

    data.forEach(async Data => {
      const SplitEmoji = Data.Emoji.replace("<:", "").replace(">", "");

      if (
        reaction.emoji.identifier === SplitEmoji &&
        reaction.message.id === Data.Message
      ) {
        const Role = Guild.roles.cache.get(Data.Role);
        const Message = Data.Message;
        const Channel = Data.Channel;
        const Emoji = Guild.emojis.cache.get(Data.Emoji);
        const Option = Data.Option;
        if (ClientCooldown.has(reaction.message.guildId)) return;

        const CooldownEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Cooldown:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Cooldown:Description",
              reaction.message,
              { GUILD: Guild.name, TIMER }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#c20e00")
          .setTimestamp();
        const AddEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Add:Description",
              reaction.message,
              { ROLE: Role.name, GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#00c26f")
          .setTimestamp();
        const RemoveEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Remove:Title",
              reaction.message,
              {}
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Remove:Description",
              reaction.message,
              { ROLE: Role.name, GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#00c26f")
          .setTimestamp();
        const ErrorEmbed = new EmbedBuilder()
          .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ extension: "gif", size: 512 })
          })
          .setTitle(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Title",
              reaction.message
            )
          )
          .setDescription(
            await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:Error:Description",
              reaction.message,
              { ROLE: Role.name, GUILD: Guild.name }
            )
          )
          .addFields([
            {
              name: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:1",
                reaction.message
              ),
              value: await client.Translate.Guild(
                "Events/ReactionRoleAdd-Remove:GlobalField:Content",
                reaction.message,
                {
                  URL: `https://discord.com/channels/${Guild.id}/${Channel}/${Message}`
                }
              )
            }
          ])
          .setFooter({
            text: await client.Translate.Guild(
              "Events/ReactionRoleAdd-Remove:GlobalFooter",
              reaction.message
            ),
            iconURL: client.user.displayAvatarURL()
          })
          .setColor("#c20e00")
          .setTimestamp();

        if (Option === 1) {
          try {
            if (
              !Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:1",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, {
                  embeds: [AddEmbed]
                }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (error) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, {
              embeds: [ErrorEmbed]
            });
            return;
          }
        }

        if (Option === 2) {
          try {
            if (
              !Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:2",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 3) {
          try {
            if (
              Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:3",
                    reaction.message
                  )
                )
                .catch(() => {});
              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 4) {
          try {
            if (
              Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:4",
                    reaction.message
                  )
                )
                .catch(() => {});
              ReactionCooldown.add(user.id);
              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 5) {
          try {
            if (
              Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              await Member.roles.remove(
                Role,
                await client.Translate.Guild(
                  "Events/ReactionRoleAdd-Remove:Options:REMOVE:5",
                  reaction.message
                )
              );
              reaction.message.reactions.cache
                .find(r => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});

              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, { embeds: [RemoveEmbed] }).catch(
                  () => {}
                );
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, TIMER);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }

        if (Option === 6) {
          try {
            if (
              Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              reaction.message.reactions.cache
                .find(r => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await Member.roles
                .remove(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:REMOVE:6",
                    reaction.message
                  )
                )
                .catch(() => {});

              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);

              return;
            } else if (
              !Member.roles.cache.find(
                r => r.name.toLowerCase() === Role.name.toLowerCase()
              )
            ) {
              reaction.message.reactions.cache
                .find(r => r.emoji.name == Emoji.name)
                .users.remove(user.id)
                .catch(() => {});
              await Member.roles
                .add(
                  Role,
                  await client.Translate.Guild(
                    "Events/ReactionRoleAdd-Remove:Options:ADD:6",
                    reaction.message
                  )
                )
                .catch(() => {});

              if (GuildData.Settings.ReactionDM) {
                MessageTools.send(user, { embeds: [AddEmbed] }).catch(() => {});
              }
              ReactionCooldown.add(user.id);
              setTimeout(() => {
                ReactionCooldown.delete(user.id);
              }, TIMER);
            }
          } catch (err) {
            ClientCooldown.add(reaction.message.guildId);
            setTimeout(() => {
              ClientCooldown.delete(reaction.message.guildId);
            }, 6000);
            MessageTools.send(user, { embeds: [ErrorEmbed] }).catch(() => {});
            return;
          }
        }
      }
    });
  }
}