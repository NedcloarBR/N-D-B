import { EventOptions } from "~/Types";
import NDBClient from "@Client/NDBClient";

export default class BaseEvent {
  public constructor(private client: NDBClient, public options: EventOptions) {
    this.client = client;
    this.options.name = options.name;
    this.options.type = options.type;
    this.options.emitter = options.emitter;
  }

  async run(client: NDBClient, ...args: any[]) {
    throw new Error(
      `Um método Run não foi implementado em: ${String(this.options.name)}`
    );
  }
}
