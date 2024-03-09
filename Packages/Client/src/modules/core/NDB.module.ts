import { NecordConfigService } from "@/modules/config/NecordConfig.service";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NecordModule } from "necord";
import { CommandsModule } from "../commands/Commands.module";
import { DatabaseModule } from "../database/database.module";
import { DeveloperToolsModule } from "../developerTools/DeveloperTools.module";
import { EventsModule } from "../events/Events.module";
import { i18nModule } from "../i18n/i18n.module";

@Module({
	imports: [
		NecordModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				...new NecordConfigService(config).createNecordOptions(),
			}),
		}),
		DatabaseModule,
		i18nModule,
		EventsModule,
		CommandsModule,
		DeveloperToolsModule,
	],
})
export class NDBModule {}
