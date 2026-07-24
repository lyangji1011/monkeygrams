import { Player } from "../../../shared/types/player.js";

export type SocketId = string;

export type Username = string;

export interface ServerPlayer extends Player {
  disconnectTimer: NodeJS.Timeout | null;
}