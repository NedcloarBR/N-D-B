import { Global, Module } from "@nestjs/common";

import { DeveloperToolsMainSlashCommand, TestCommand } from "./commands";

@Global()
@Module({
	providers: [DeveloperToolsMainSlashCommand, TestCommand],
})
export class DeveloperToolsModule {}
