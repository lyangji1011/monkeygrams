import { ServerPlayer } from "./player.js";

export type SocketId = string;

export type RoomCode = string;

export enum RoomState {
	LOBBY = 1,
	PLAYING = 2,
	RESULTS = 3,
}

export interface Room {
	players: Map<SocketId, ServerPlayer>;
	state: RoomState;
}
