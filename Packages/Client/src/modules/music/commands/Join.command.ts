import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import { Extends } from "@/types/Constants";
import { Ii18nService } from "@/types/Interfaces";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message, VoiceChannel, channelMention } from "discord.js";
import { CommandContext } from "../../commands/Commands.context";
import { IMusicService } from "../interfaces";
import { Music } from "../types/constants";

@Injectable()
export class JoinCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
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

		if (!this.service.hasVoice(context)) return;

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
			await this.Translate.Guild(context, "Tools/Music:Join", {
				VoiceChannel: channelMention(player.voiceChannelId),
			}),
		);
	}
}