import * as Discord from "discord.js";
import { ClientOptions, Collections, Config } from "~/Config";
import { EventHandler, CommandHandler, SlashHandler } from "@Utils/Handlers";
import { Logger, Tools, Mongoose } from "@Utils/Tools";

export default class NDBClient extends Discord.Client {
  public ReadyState: boolean = false;
  public Config: typeof Config = Config;
  public Collections: Collections = new Collections();
  private EventHandler: EventHandler = new EventHandler(this);
  private CommandHandler: CommandHandler = new CommandHandler(this);
  private SlashHandler: SlashHandler = new SlashHandler(this);
  public readonly logger: Logger = new Logger();
  public readonly Tools: Tools = new Tools(this);
  public readonly Mongoose: Mongoose = new Mongoose(this);

  public constructor() {
    super(ClientOptions);
  }

  public async Start(): Promise<void> {
    await this.CommandHandler.loadCommands();
    await this.EventHandler.loadEvents();
    // ! For some reason the SlashCommands Handler doesn't work if it's not inside ReadyEvent
    this.once("ready", async () => {
      await this.SlashHandler.loadSlashCommands();
    });
    await this.Mongoose.start();
    var Token: string;
    switch (process.env.NODE_ENV) {
      case "Development":
        Token = process.env.DevToken;
        break;
      case "Production":
        Token = process.env.Token;
        break;
    }
    await this.login(Token).catch((error: Error) => {
      this.logger.error(
        `Não foi possível se conectar a Gateway do Discord devido ao Erro: ${error}`
      );
    });
  }

  public setShardPresence(
    type: Discord.ActivityType,
    name: string,
    url: string
  ): Discord.Presence {
    return this.user?.setPresence({
      activities: [
        {
          // TODO: Discord.js won't accept all ActivityType's here
          // Need to find a solution to remove "any"
          type: type as any,
          name,
          url,
        },
      ],
    });
  }
}
