import { ServerPlayer } from "./player.js";

export type SocketId = string;

export type RoomCode = string;

export interface Room {
  players: Map<SocketId, ServerPlayer>;
}