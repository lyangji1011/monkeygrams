import PlayerHand from "./PlayerHand";
import DumpZone from "./DumpZone";
import type { Tile } from "../../../shared/types/tile";
import PlayerActionButtons from "./PlayerActionButtons";

export default function GameFooter({
	onPlaceTile,
	playerHandTiles,
}: {
	onPlaceTile: (e: MouseEvent | null, tile: Tile) => void;
	playerHandTiles: Tile[] | null;
}) {
	return (
		<div className="game-footer">
			<PlayerActionButtons />
			<PlayerHand onPlaceTile={onPlaceTile} playerHandTiles={playerHandTiles} />
			<DumpZone />
		</div>
	);
}
