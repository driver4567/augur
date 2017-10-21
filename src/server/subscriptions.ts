import * as uuidv4 from "uuid/v4";
import { EventEmitter } from "events";
import { augurEmitter } from "../events";
import { ErrorCallback } from "../types";

export class SubscriptionError extends Error {};

export class Subscriptions extends EventEmitter {
  subscribe(eventName: string, params: any, publish: (data: {}) => void): string {
    switch(eventName) {
      case "MarketCreated":
        return this.subscribeToEvent(eventName, params, publish);
      default:
        throw new SubscriptionError(`Event ${eventName} not available for subscription`);
    }
  }

  unsubscribe(subscription: string): void  {
    this.emit(`unsubscribe:${subscription}`);
  }

  removeAllListeners(eventName?: string | symbol | undefined): this {
    this.emit("removeAllListeners");
    return super.removeAllListeners(eventName);
  }

  private subscribeToEvent(eventName: string, params: any, publish: (data: {}) => void): string {
    const subscription: string = uuidv4();

    let handler = (data: {}): void => {
      this.emit(eventName, data);
    };

    augurEmitter.on(eventName, handler);

    this.on(eventName, publish);

    // Unsubscribe from one subscription
    this.on(`unsubscribe:${publish}`, (): void => {
      this.removeListener(eventName, publish);
      augurEmitter.removeListener(eventName, handler);
    });

    // Cleanup augurEmitter when we're clearing this one
    this.on("removeAllListeners", (): void => {
      augurEmitter.removeListener(eventName, handler);
    });

    return subscription;
  }
}
