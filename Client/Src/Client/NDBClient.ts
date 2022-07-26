import { Client } from "discord.js";
import { _ClientOptions, Collections } from "~/Config/ClientUtils";
import {
  EventHandler,
  CommandHandler,
  SlashHandler,
  LanguageHandler,
  Translate,
} from "@Utils/Handlers";
import { Logger, Mongoose, Tools } from "@Utils/Tools";

export default class NDBClient extends Client {
  public Collections: Collections = new Collections();
  public Tools: Tools = new Tools(this);
  public Translate: Translate = new Translate(this);

  public readonly logger: Logger = new Logger();
  public readonly Mongoose: Mongoose = new Mongoose(this);

  private readonly EventHandler: EventHandler = new EventHandler(this);
  private readonly CommandHandler: CommandHandler = new CommandHandler(this);
  private readonly SlashHandler: SlashHandler = new SlashHandler(this);

  public constructor() {
    super(_ClientOptions);
  }

  public async Start(): Promise<void> {
    await this.EventHandler.loadEvents();
    await this.CommandHandler.loadCommands();
    this.once("ready", async () => {
      await this.SlashHandler.loadSlashCommands();
    });

    this.Collections.translations = await LanguageHandler();
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
}