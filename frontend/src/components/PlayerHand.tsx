import { createRef, useMemo } from "react";
import DraggableLib from "react-draggable";
import type { DraggableProps } from "react-draggable";
import type { Tile } from "../../../shared/types/tile";

const Draggable = DraggableLib as unknown as React.ComponentType<
	Partial<DraggableProps>
>;

function PlayerHand({
	onPlaceTile,
	playerHandTiles,
}: {
	onPlaceTile: (tile: Tile) => void;
	playerHandTiles: Tile[] | null;
}) {
	const tileRefs = useMemo(() => {
		const refs = new Map<string, React.RefObject<HTMLDivElement | null>>();
		playerHandTiles?.forEach((tile: Tile) => {
			refs.set(tile.id, createRef<HTMLDivElement>());
		});
		return refs;
	}, [playerHandTiles]);

	return (
		<div className="player-hand">
			{playerHandTiles?.map((tile: Tile) => (
				<Draggable
					nodeRef={tileRefs.get(tile.id)!}
					key={tile.id}
					enableUserSelectHack
					onStop={() => onPlaceTile(tile)}
				>
					<div ref={tileRefs.get(tile.id)!} className="tile">
						{tile.letter}
					</div>
				</Draggable>
			))}
		</div>
	);
}

export default PlayerHand;
