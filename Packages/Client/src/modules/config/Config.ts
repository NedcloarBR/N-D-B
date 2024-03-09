import { Config, ENVIRONMENT } from "@/types";

export const config = (): Config => ({
	ENVIRONMENT: process.env.ENVIRONMENT as ENVIRONMENT,
	Database: {
		Version: "Music",
		URL: process.env.DATABASE_URL,
		Name: process.env.DatabaseName,
		Password: process.env.DatabasePassword,
		Redis: {
			Port: process.env.RedisPort,
			Host: process.env.RedisHost,
		},
	},
	Discord: {
		Token: process.env.Token,
		DevToken: process.env.DevToken,
		Client: {
			Owners: [""],
			Secret: process.env.ClientSecret,
			ID: "",
		},
		Servers: {
			NDCommunity: "",
			TestGuild: "",
		},
	},
	Debug: {
		Client: true,
		Translations: false,
		Lavalink: false,
		PremiumMusicPlayer: false,
	},
});
