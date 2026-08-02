import { tileDistribution } from "../data/tileDistribution.js";
import { RoomState } from "../types/room.js";
import { Tile } from "../../../shared/types/tile.js";
import { getRoom } from "./rooms.js";

export function startGame(roomCode: string) {
	const room = getRoom(roomCode);
	if (!room) return null;

	room.state = RoomState.PLAYING;
	room.gameState.bag = createTileBag();

	for (const [socketId, player] of room.players.entries()) {
		const hand = createStartingHand(
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

export function createStartingHand(
	bag: Tile[],
	startingHandSize: number,
): Tile[] {
	const hand: Tile[] = [];

	for (let i = 0; i < startingHandSize; i++) {
		const randomIndex = Math.floor(Math.random() * bag.length);
		const tile = bag.splice(randomIndex, 1)[0];
		hand.push(tile);
	}

	return hand;
}

function getStartingHandSize(playerCount: number) {
	if (playerCount <= 4) return 21;
	if (playerCount <= 6) return 15;
	return 11;
}
