import { CommandPermissions } from "@/common/decorators";
import { Config } from "@/modules/config/types";
import type { Ii18nService } from "@/modules/i18n/interfaces/Ii18nService";
import { Extends } from "@/types/Constants";
import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Utils } from "../Utils";

export class OwnerPermissionGuard implements CanActivate {
	public constructor(
		@Inject(Extends.Translate) private readonly Translate: Ii18nService,
		private readonly config: ConfigService<Config>,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(executionContext: ExecutionContext): Promise<boolean> {
		const permissions = this.reflector.get(CommandPermissions.KEY, executionContext.getHandler());
		const { context } = Utils.context(executionContext);

		if (permissions.ownerOnly && !this.checkOwner(context.author.id)) {
			Utils.SendFunction(context, await this.Translate.TFunction(context, "Tools/Command:Checker:OwnerOnly"));
			return false;
		}

		return true;
	}

	private checkOwner(target: string) {
		return this.config.getOrThrow<Config["Discord"]>("Discord").Client.Owners.includes(target);
	}
}
