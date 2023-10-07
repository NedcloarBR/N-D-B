import { EventOptions, INDBClient } from "@/Types";
import { BaseCommand, BaseEvent } from "@/Utils/Structures";
import Context from "@/Utils/Structures/Context";
import { CommandChecker } from "@/Utils/Tools";
import { ChannelType, Message } from "discord.js";

export default class CommandEvent extends BaseEvent {
  constructor(client: INDBClient) {
    const options: EventOptions = {
      name: "Command",
      type: "on",
      emitter: "client",
      enable: true
    };

    super(client, options);
  }

  async run(
    client: INDBClient,
    message: Message,
    Prefix: string,
    Premium: boolean
  ) {
    if (message.channel.type === ChannelType.DM) return;
    const cmdTools = new CommandChecker(client);
    const [cmd, ...args] = message.content
      .slice(Prefix.length)
      .trim()
      .split(/ +/g);
    const context = new Context(message, args as Array<string>, {});
    const _Command: BaseCommand = client.Tools.resolveCommand(cmd);
    if (_Command) {
      const Checker = await cmdTools.runCheck(context, _Command, Prefix, args);
      if (Checker) {
        _Command.run(client, context, Premium);
      }
    }
  }
}
