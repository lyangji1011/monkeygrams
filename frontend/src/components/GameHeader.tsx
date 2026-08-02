import PlayerHand from "./PlayerHand";
import PlayerActionZone from "./PlayerActionZone";
import type { Tile } from "../../../shared/types/tile";

export default function GameHeader({
	onPlaceTile,
	playerHandTiles,
}: {
	onPlaceTile: (tile: Tile) => void;
	playerHandTiles: Tile[] | null;
}) {
	return (
		<div className="game-header">
			<PlayerHand onPlaceTile={onPlaceTile} playerHandTiles={playerHandTiles} />
			<PlayerActionZone />
		</div>
	);
}
