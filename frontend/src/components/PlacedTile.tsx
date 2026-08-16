import { useRef, useState } from "react";
import DraggableLib from "react-draggable";
import type { DraggableProps } from "react-draggable";
import type { Tile } from "../../../shared/types/tile";

const Draggable = DraggableLib as unknown as React.ComponentType<
	Partial<DraggableProps>
>;

interface PlacedTileProps {
	rowIndex: number;
	colIndex: number;
	tileData: Tile;
	onTileDragged: (
		tileData: Tile,
		origRow: number,
		origCol: number,
	) => void;
	onTileRemoved: (rowIndex: number, colIndex: number) => void;
}

function PlacedTile({
	tileData,
	rowIndex,
	colIndex,
	onTileDragged,
	onTileRemoved,
}: PlacedTileProps) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);

	return (
		<Draggable
			nodeRef={nodeRef}
			enableUserSelectHack
			position={isDragging ? position : { x: 0, y: 0 }}
			onStart={() => {
				setIsDragging(true);
			}}
			onDrag={(e, d) => {
				setPosition({ x: d.x, y: d.y });
			}}
			onStop={() => {
				setIsDragging(false);
				setPosition({ x: 0, y: 0 });
				onTileRemoved(rowIndex, colIndex);
				onTileDragged(tileData, rowIndex, colIndex);
			}}
		>
			<div ref={nodeRef} className="tile">
				{tileData.letter}
			</div>
		</Draggable>
	);
}

export default PlacedTile;
