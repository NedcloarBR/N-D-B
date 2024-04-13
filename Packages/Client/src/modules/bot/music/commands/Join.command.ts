import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { LOCALIZATION_ADAPTER, NestedLocalizationAdapter } from "@necord/localization";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message, VoiceChannel, channelMention } from "discord.js";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";
import { Music } from "../types/constants";

@Injectable()
export class JoinCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(LOCALIZATION_ADAPTER) private readonly translate: NestedLocalizationAdapter,
	) {}

	private readonly logger = new Logger(JoinCommand.name);

	@LegacyCommand({
		name: "join",
		aliases: ["Join"],
		description: "Join's a voice channel",
		usage: "",
	})
	@SlashCommand({
		name: "join",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["Connect", "EmbedLinks", "DeafenMembers", "Speak"],
		user: ["Connect", "SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		let player = await this.service.getPlayer(context);

		if (!(await this.service.hasVoice(context))) return;

		if (!player) {
			player = await this.service.createPlayer(
				context,
				(await context.getMember()).voice.channel as VoiceChannel,
				context.channel.id,
			);
		}

		if (!player.connected) {
			player.playerAuthor = context.author.id;
			await player.connect();
		}

		return context.reply(
			this.translate.getTranslation("Tools/Music:Join", context.guild.preferredLocale, {
				VoiceChannel: channelMention(player.voiceChannelId),
			}),
		);
	}
}
