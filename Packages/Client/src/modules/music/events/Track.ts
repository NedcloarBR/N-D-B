import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Timer, WAIT } from "@/utils/Tools";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Client, GuildChannel, GuildMember, Message, TextChannel } from "discord.js";
import { Player, Track, TrackEndEvent, TrackExceptionEvent, TrackStartEvent } from "lavalink-client";
import { Music } from "../";
import { MessageTools } from "../../commands/Message";
import type { IMusicEmbeds, IMusicService } from "../interfaces";

@Injectable()
export class TrackEvents {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		@Inject(Music.Embeds) private readonly embeds: IMusicEmbeds,
		@Inject(Music.Service) private readonly service: IMusicService,
		private readonly client: Client,
	) {}

	private readonly logger = new Logger(TrackEvents.name);

	@OnEvent("track.start")
	public async onTrackStart(player: Player, track: Track, payload: TrackStartEvent): Promise<void> {
		const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;

		const Requester = (
			(await (await this.client.guilds.fetch(player.guildId)).members.fetch(track.requester as string)) as GuildMember
		).user;

		await WAIT(500);

		MessageTools.send(textChannel, {
			embeds: [
				await this.embeds.TrackStart(
					textChannel,
					track,
					Requester,
					await Timer(this.Translate, "normal", track.info.duration, textChannel as GuildChannel),
					await this.service.URLChecker(false, track.info.uri),
					this.service.formatSourceName(track.info.sourceName),
				),
			],
		}).then((msg) => {
			try {
				const CURRENT_SONG_MSG = textChannel.messages.cache.get(player.songMessage) as Message;
				if (CURRENT_SONG_MSG && msg.id !== CURRENT_SONG_MSG.id) {
					CURRENT_SONG_MSG.delete().catch((error: Error) => {
						this.logger.warn('Não consegui deletar a "CURRENT_SONG_MSG"', error);
					});
				}
			} catch {}
			player.songMessage = msg.id;
		});
	}

	@OnEvent("track.end")
	public async onTrackEnd(player: Player, track: Track, payload: TrackEndEvent) {
		player.lastSong = track;
	}

	@OnEvent("track.stuck")
	public async onTrackStuck(player: Player, track: Track, payload: TrackStartEvent) {
		const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
		MessageTools.send(textChannel, { embeds: [await this.embeds.TrackStuck(textChannel, track)] });
	}

	@OnEvent("track.error")
	public async onTrackError(player: Player, track: Track, payload: TrackExceptionEvent) {
		const textChannel = this.client.channels.cache.get(player.textChannelId) as TextChannel;
		MessageTools.send(textChannel, { embeds: [await this.embeds.TrackError(textChannel, track, payload)] });
	}
}
