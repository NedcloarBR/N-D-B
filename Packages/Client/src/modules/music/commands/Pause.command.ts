import { CommandConfig, CommandPermissions, LegacyCommand, SlashCommand } from "@/common/decorators";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message } from "discord.js";
import { Music } from "../";
import { CommandContext } from "../../commands/Commands.context";
import type { IMusicService } from "../interfaces";

@Injectable()
export class PauseCommand {
	public constructor(
		@Inject(Music.Service) private readonly service: IMusicService,
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
	) {}

	private readonly logger = new Logger(PauseCommand.name);

	@LegacyCommand({
		name: "pause",
		aliases: ["Pause"],
		description: "Pauses the music Queue",
		usage: "",
	})
	@SlashCommand({
		name: "pause",
		type: "Sub",
		deployMode: "Test",
	})
	@CommandConfig({ category: "🎵 Music" })
	@CommandPermissions({
		bot: ["SendMessages"],
		user: ["SendMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	public async onCommandRun([client, context]: CommandContext): Promise<Message> {
		const player = await this.service.getPlayer(context);
		if (!(await this.service.checkers(context))) return;
		await player.pause();
		return context.reply(await this.Translate.Guild(context, "Tools/Music:Pause"));
	}
}
