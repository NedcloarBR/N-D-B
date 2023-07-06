import NDBClient from "@/Core/NDBClient"
import { EventOptions } from "@/Types"
import { BaseEvent } from "@/Utils/Structures"

export default class unhandledRejectionEvent extends BaseEvent {
  constructor(client: NDBClient) {
    const options: EventOptions = {
      name: "unhandledRejection",
      type: "on",
      emitter: "process",
      enable: false
    }

    super(client, options)
  }

  async run(client: NDBClient, reason: Error, promise) {
    client.logger.process(
      "Unhandled Rejection",
      `Reason in: ${promise} Error: ${
        reason.stack ? String(reason.stack) : String(reason)
      }`
    )
  }
}
