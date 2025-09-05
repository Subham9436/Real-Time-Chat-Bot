import { Server } from "socket.io";
import http from "http";
export declare const app: import("express-serve-static-core").Express;
export declare const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export declare const socketServer: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getReceiverSocketId(userId: string): string | undefined;
