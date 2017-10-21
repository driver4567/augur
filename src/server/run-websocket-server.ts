import * as WebSocket from "ws";
import * as Knex from "knex";
import { EventEmitter } from "events";
import { JsonRpcRequest, JsonRpcSubscribeRequest } from "../types";
import { isJsonRpcRequest } from "./is-json-rpc-request";
import { dispatchJsonRpcRequest } from "./dispatch-json-rpc-request";
import { makeJsonRpcResponse } from "./make-json-rpc-response";
import { Subscriptions, SubscriptionError } from "./subscriptions";

export function runWebsocketServer(db: Knex, port: number): void {
  console.log("Starting websocket server on port", port);
  const websocketServer: WebSocket.Server = new WebSocket.Server({ port });
  websocketServer.on("connection", (websocket: WebSocket): void => {
    const subscriptions = new Subscriptions();

    websocket.on("message", (data: WebSocket.Data): void => {
      try {
        const message = JSON.parse(data as string);
        if (!isJsonRpcRequest(message)) return console.error("bad json rpc message received:", message);

        if (message.method === "subscribe") {
          const eventName: string = message.params.shift();

          try {
            const subscription: string = subscriptions.subscribe(eventName, message.params, (data: {}): void => {
              websocket.send(makeJsonRpcResponse(message.id, { subscription, result: data}));
            });
            websocket.send(makeJsonRpcResponse(message.id, { subscription }));
          } catch(exc) {
            if(exc instanceof SubscriptionError) {
              console.error("suscription error", exc, data);
              websocket.send(makeJsonRpcResponse(message.id, false));
            } else
              throw exc;
          }
        } else if (message.method === "unsubscribe") {
          const subscription: string = message.params.shift();
          subscriptions.unsubscribe(subscription);
          websocket.send(makeJsonRpcResponse(message.id, true));
        } else {
          dispatchJsonRpcRequest(db, message as JsonRpcRequest, (err?: Error|null, result?: any): void => {
            if (err) return console.error("dispatch error: ", err);
            websocket.send(makeJsonRpcResponse(message.id, result || null));
          });
        }
       } catch (exc) {
         console.error("bad json rpc message received:", exc, data);
       }
    });

    websocket.on("close", () => {
      subscriptions.removeAllListeners();
    });
  });

  websocketServer.on("error", (err: Error): void => {
    console.log("websocket error:", err);
    // TODO reconnect
  });
}
