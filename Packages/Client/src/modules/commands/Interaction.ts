import { Content } from "@/types";
import { Tools } from "@/utils/Tools";
import {
	BaseMessageOptions,
	CommandInteraction,
	EmbedBuilder,
	InteractionReplyOptions,
	InteractionUpdateOptions,
	Message,
	MessageComponentInteraction,
} from "discord.js";

export class InteractionTools {
	public static async deferReply(
		interaction: CommandInteraction | MessageComponentInteraction,
		ephemeral = false,
	): Promise<unknown> {
		return interaction.deferReply({
			ephemeral,
		});
	}

	public static async deferUpdate(interaction: MessageComponentInteraction): Promise<unknown> {
		return await interaction.deferUpdate();
	}

	/**
	 * @method Reply or followUp(reply again) the interaction
	 */

	public static async reply(
		interaction: CommandInteraction | MessageComponentInteraction,
		content: Content,
		ephemeral: boolean,
	): Promise<Message> {
		const msgOptions = Tools.messageOptions(content) as InteractionReplyOptions;

		if (interaction.deferred || interaction.replied) {
			return await interaction.followUp({
				...msgOptions,
				ephemeral,
			});
		}
		return await interaction.reply({
			...msgOptions,
			ephemeral,
			fetchReply: true,
		});
	}

	/**
	 * @method Edit the interaction
	 */

	public static async editReply(
		interaction: CommandInteraction | MessageComponentInteraction,
		content: string | EmbedBuilder | BaseMessageOptions,
	): Promise<Message> {
		const msgOptions = Tools.messageOptions(content);
		return (await interaction.editReply({
			...msgOptions,
		})) as Message;
	}

	public static async update(
		interaction: MessageComponentInteraction,
		content: string | EmbedBuilder | BaseMessageOptions,
	): Promise<Message> {
		const msgOptions = Tools.messageOptions(content) as InteractionUpdateOptions;
		return (await interaction.update({
			...msgOptions,
			fetchReply: true,
		})) as Message;
	}
}
