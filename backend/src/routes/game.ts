import { tileDistribution } from "../data/tileDistribution.js";
import { RoomCode, RoomState, SocketId } from "../types/room.js";
import { Tile } from "../../../shared/types/tile.js";
import { getPlayerFromSocketId, getRoom } from "./rooms.js";

export function startGame(roomCode: string) {
	const room = getRoom(roomCode);
	if (!room) return null;

	room.state = RoomState.PLAYING;
	room.gameState.bag = createTileBag();

	for (const [socketId, _] of room.players.entries()) {
		const hand: Tile[] = [];
		addRandomTilesToHand(
			hand,
			room.gameState.bag,
			getStartingHandSize(room.players.size),
		);
		room.gameState.hands.set(socketId, hand);
	}

	return {
		roomState: room.state,
		gameState: room.gameState,
	};
}

function createTileBag(): Tile[] {
	const bag: Tile[] = [];

	for (const [letter, count] of Object.entries(tileDistribution)) {
		for (let i = 0; i < count; i++) {
			bag.push({
				id: crypto.randomUUID(),
				letter,
			});
		}
	}

	return bag;
}

function getStartingHandSize(playerCount: number) {
	if (playerCount <= 4) return 21;
	if (playerCount <= 6) return 15;
	return 11;
}

export function dumpTile(
	dumpedTile: Tile,
	roomCode: RoomCode,
	socketId: SocketId,
) {
	const room = getRoom(roomCode);
	if (!room) return;
	const hand = room.gameState.hands.get(socketId);
	if (!hand) return;
	const bag = room?.gameState.bag;
	if (!bag) return;

	removeTileFromHand(hand, bag, dumpedTile);
	return addRandomTilesToHand(hand, bag, 3);
}

export function peel(roomCode: RoomCode) {
	const room = getRoom(roomCode);
	if (!room) return null;
	const bag = room.gameState.bag;
	if (!bag) return null;

	for (const [socketId, _] of room.players) {
		const hand = room.gameState.hands.get(socketId);
		if (!hand) continue;
		addRandomTilesToHand(hand, bag, 1);
	}
}

function addRandomTilesToHand(
	hand: Tile[],
	bag: Tile[],
	numberOfTiles: number,
) {
	let addedTiles = [];

	for (let i = 0; i < numberOfTiles; i++) {
		const randomIndex = Math.floor(Math.random() * bag.length);
		const tile = bag.splice(randomIndex, 1)[0];
		hand.push(tile);
		addedTiles.push(tile);
	}

	return addedTiles;
}

function removeTileFromHand(hand: Tile[], bag: Tile[], tile: Tile) {
	const tileIndex = hand.findIndex((t) => t.id === tile.id);
	if (tileIndex < 0) {
		throw Error("Tile not found in player hand");
	}
	hand.splice(tileIndex, 1);
	bag.push(tile);
}
