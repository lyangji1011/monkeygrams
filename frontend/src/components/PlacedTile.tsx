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
	onTileDumped?: (tileData: Tile) => void;
	onTileReturnedToHand?: (tileData: Tile) => void;
}

function PlacedTile({
	tileData,
	rowIndex,
	colIndex,
	onTileDragged,
	onTileRemoved,
	onTileDumped,
	onTileReturnedToHand,
}: PlacedTileProps) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);

	function handleDragStart() {
		setIsDragging(true);
	}

	function handleDrag(_e: any, d: any) {
		setPosition({ x: d.x, y: d.y });
	}

	function handleDragStop(e: any) {
		setIsDragging(false);
		setPosition({ x: 0, y: 0 });
		onTileRemoved(rowIndex, colIndex);

		const elementsAtCursor = document.elementsFromPoint(e.clientX, e.clientY);
		const isOverDropZone = elementsAtCursor.some(el => el.classList.contains('dump-zone'));
		const isOverGameFooter = elementsAtCursor.some(el => el.classList.contains('game-footer'));

		if (isOverDropZone) {
			onTileDumped?.(tileData);
		} else if (isOverGameFooter) {
			onTileReturnedToHand?.(tileData);
		} else {
			onTileDragged(tileData, rowIndex, colIndex);
		}
	}

	return (
		<Draggable
			nodeRef={nodeRef}
			enableUserSelectHack
			position={isDragging ? position : { x: 0, y: 0 }}
			onStart={handleDragStart}
			onDrag={handleDrag}
			onStop={handleDragStop}
		>
			<div ref={nodeRef} className="tile">
				{tileData.letter}
			</div>
		</Draggable>
	);
}

export default PlacedTile;
