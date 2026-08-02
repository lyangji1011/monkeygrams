import { SocketId } from "./player.js";
import { Tile } from "../../../shared/types/tile.js";

export type GameState = {
	bag: Tile[];
	hands: Map<SocketId, Tile[]>;
};
