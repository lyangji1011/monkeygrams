import { memo, useRef } from "react";
import DraggableLib from "react-draggable";
import type { DraggableProps } from "react-draggable";
import type { Tile as TileType } from "../../../shared/types/tile";

const Draggable = DraggableLib as unknown as React.ComponentType<
	Partial<DraggableProps>
>;

const Tile = memo(function Tile({
	tile,
	onPlaceTile,
}: {
	tile: TileType;
	onPlaceTile: (e: MouseEvent | null, tile: TileType) => void;
}) {
	const nodeRef = useRef<HTMLDivElement>(null);

	return (
		<Draggable
			nodeRef={nodeRef}
			enableUserSelectHack
			onStop={(e) => {
				onPlaceTile(e, tile);
			}}
		>
			<div ref={nodeRef} className="tile">
				{tile.letter}
			</div>
		</Draggable>
	);
});

function EmptyTile() {
	return <div className="tile-empty" />;
}

export { Tile, EmptyTile };
