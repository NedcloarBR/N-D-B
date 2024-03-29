import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import type { INDBService } from "@/modules/core/interfaces/INDBService";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends, Services } from "@/types/Constants";
import { Timer } from "@/utils/Tools";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { EmbedBuilder, Message, UserManager } from "discord.js";
import { Track, UnresolvedTrack } from "lavalink-client";
import { Music } from "..";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class QueueCommand {
	public constructor(
		@Inject(Services.NDB) private readonly NDBService: INDBService,
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly users: UserManager,
	) {}

	private readonly logger = new Logger(QueueCommand.name);

	@LegacyCommand({
		name: "Queue",
		aliases: ["queue"],
		description: "Shows the music Queue",
		usage: "",
	})
	@SlashCommand({
		name: "queue",
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
		if (!(await this.service.checkers(context))) {
			return;
		}

		const player = await this.service.getPlayer(context);

		const embeds: Array<EmbedBuilder> = [];
		const queue: Array<Track | UnresolvedTrack> = player.queue.tracks;

		for (const track of queue) {
			const Requester = await this.users.fetch(track.requester as string);

			embeds.push(
				new EmbedBuilder()
					.setAuthor({
						name: client.user.username,
						iconURL: client.user.displayAvatarURL(),
					})
					.setTitle(
						await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Title", {
							TITLE: track.info.title,
						}),
					)
					.setThumbnail(track.info.artworkUrl)
					.addFields([
						{
							name: await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Fields:1", {
								EMOJI: (await this.service.URLChecker(false, track.info.uri)).Emoji,
							}),
							value: `> ${await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Fields:Content:1", {
								Platform: this.service.formatSourceName(track.info.sourceName),
								URI: track.info.uri,
							})}`,
							inline: true,
						},
						{
							name: await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Fields:2"),
							value: `> ${await this.Translate.Guild(
								context,
								"Events/PlayerEvents:trackStart:Embed:Fields:Content:2",

								{
									AUTHOR: track.info.author,
								},
							)}`,
							inline: true,
						},
						{
							name: await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Fields:3"),
							value: `> ${
								track.info.isStream
									? await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Fields:Content:3²")
									: await this.Translate.Guild(
											context,
											"Events/PlayerEvents:trackStart:Embed:Fields:Content:3",

											{
												TIMER: await Timer(this.Translate, "normal", track.info.duration, context),
											},
									  )
							}`,
							inline: true,
						},
					])
					.setColor("#00c26f")
					.setFooter({
						text: await this.Translate.Guild(context, "Events/PlayerEvents:trackStart:Embed:Footer", {
							REQUESTER: Requester.username,
						}),
						iconURL: Requester.displayAvatarURL(),
					})
					.setTimestamp(),
			);
		}

		await context.reply(await this.NDBService.buildPaginator(context, embeds, `queue-${context.guild.id}`));
	}
}
