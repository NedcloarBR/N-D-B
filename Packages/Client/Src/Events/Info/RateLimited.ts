import { Config } from "@/Config/Config"
import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

export default class rateLimitedEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "rateLimited",
      type: "once",
      emitter: "rest",
      enable: true
    }

    super(client, options)
  }

  async run(client: NDBClient, { route, timeout }) {
    if (Config.Debug.Client === true)
      client.logger.error(`Rate limit: ${route} (Cooldown: ${timeout}ms)`)
  }
}
