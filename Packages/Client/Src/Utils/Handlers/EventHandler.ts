import NDBClient from "@/Core/NDBClient";
import { parse } from "path";
import { BaseEvent } from "../Structures";
import BaseHandler from "./BaseHandler";

export default class EventHandler {
  public constructor(private client: NDBClient) {
    this.client = client;
  }

  async load() {
    this.client.Collections.events.clear();
    const baseHandler = new BaseHandler(this.client);

    const eventFiles = await baseHandler.getFiles("Events");
    eventFiles.forEach(async eventFile => {
      const { name } = parse(eventFile);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const File = await baseHandler.findClass(require(eventFile));
      if (!File) {
        throw new TypeError(`Event: ${name} não exportou uma Class`);
      }

      const event = new File(this.client, name.toLowerCase());
      if (!(event instanceof BaseEvent)) {
        throw new TypeError(`Event: ${name} não esta em Events`);
      }
      this.client.Collections.events.set(String(event.options.name), event);

      const HandlerList = [
        { emitter: "client", value: this.client },
        { emitter: "rest", value: this.client.rest },
        { emitter: "process", value: process },
        { emitter: "music", value: this.client.ErelaManager }
      ];

      for (const Prop of HandlerList) {
        switch (event.options.emitter) {
          case String(Prop.emitter):
            Object(Prop.value)[event.options.type](
              event.options.name,
              (...args: unknown[]) => {
                if (event.options.enable) {
                  event.run(this.client, ...args);
                }
              }
            );
        }
      }

      // var HandlerObject = [...new Set([])]
      //   .map(object => {
      //     return {
      //       emitter: object.emitter,
      //       value: object.value
      //     }
      //   })
      //   .map(async object => {
      //     switch (event.options.emitter) {
      //       case String(object.emitter):
      //         Object(object.value)[event.options.type](
      //           event.options.name,
      //           (...args: any[]) => {
      //             if (event.options.enable) {
      //               event.run(this.client, ...args)
      //             }
      //           }
      //         )
      //         break
      //     }
      //   })
    });
  }
}
