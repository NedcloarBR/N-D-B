import { CommandConfig, CommandPermissions } from "@/common/decorators";
import { CommandConfigGuard, CommandPermissionsGuard } from "@/common/guards";
import { WAIT } from "@/utils/Tools";
import { CurrentTranslate, TranslationFn, localizationMapByKey } from "@necord/localization";
import { Logger, UseGuards } from "@nestjs/common";
import { channelMention } from "discord.js";
import { Ctx, Options, SlashCommandContext, Subcommand } from "necord";
import { ModerationCommand } from "../../Moderation.decorator";
import { ClearDTO } from "./clear.dto";

@ModerationCommand()
export class ClearCommand {
	private readonly logger = new Logger(ClearCommand.name);

	@Subcommand({
		name: "clear",
		description: "Clear a number of messages in the selected channel",
		nameLocalizations: localizationMapByKey("Moderation.clear.name"),
		descriptionLocalizations: localizationMapByKey("Moderation.clear.description"),
	})
	@CommandConfig({ category: "🛡️ Moderation", disable: false })
	@CommandPermissions({
		bot: [],
		user: ["ManageMessages"],
		guildOnly: false,
		ownerOnly: false,
	})
	@UseGuards(CommandConfigGuard, CommandPermissionsGuard)
	public async OnCommandRun(
		@Ctx() [interaction]: SlashCommandContext,
		@Options() { amount, channel }: ClearDTO,
		@CurrentTranslate() t: TranslationFn,
	) {
		if (!channel) {
			channel = interaction.channel;
		}
		const fetched = await channel.messages.fetch({
			limit: amount,
		});
		try {
			channel.bulkDelete(fetched);
			const res = await interaction.reply({
				content: t("Moderation.clear.response.success", { amount, channel: channelMention(channel.id) }),
				ephemeral: false,
			});
			await WAIT(4000);
			res.delete();
		} catch (error) {
			interaction.reply({
				content: t("Moderation.clear.response.error"),
				ephemeral: true,
			});
		}
	}
}
