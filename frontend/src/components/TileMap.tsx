import { useRef, useEffect, useState } from "react";
import DraggableLib from "react-draggable";
import type { DraggableProps } from "react-draggable";
import { EmptyTile } from "./Tile";
import type { Tile } from "../../../shared/types/tile";

const Draggable = DraggableLib as unknown as React.ComponentType<
	Partial<DraggableProps>
>;

function TileMap({
	updatedTile,
	onPlaceTile,
	addTileToPlayerHand,
}: {
	updatedTile: Tile | null;
	onPlaceTile: (e: MouseEvent, tileData: Tile | null) => void;
	addTileToPlayerHand: (tileData: Tile) => void;
}) {
	const nodeRef = useRef<HTMLDivElement>(null);
	const selectedTileRef = useRef<[number, number]>([-1, -1]);

	const SIZE = 15;

	const [tiles, setTiles] = useState<Map<string, Tile>>(new Map());
	const getTileKey = (r: number, c: number) => `${r},${c}`;

	useEffect(() => {
		if (!updatedTile) return;

		const selectedRow = selectedTileRef.current[0];
		const selectedCol = selectedTileRef.current[1];

		const isValidPlacement =
			selectedRow >= 0 &&
			selectedCol >= 0 &&
			tiles.get(getTileKey(selectedRow, selectedCol)) === undefined;

		if (isValidPlacement) {
			setTiles((prev) => {
				const newTiles = new Map(prev);
				newTiles.set(getTileKey(selectedRow, selectedCol), updatedTile);
				return newTiles;
			});
		} else {
			addTileToPlayerHand(updatedTile);
		}

		onPlaceTile(new MouseEvent("mousedown"), null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updatedTile]);

	function handleMouseMove(
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) {
		const tile = document.elementFromPoint(
			event.clientX,
			event.clientY,
		) as HTMLElement;
		if (
			tile &&
			(tile.classList.contains("tile") || tile.classList.contains("tile-empty"))
		) {
			const rowIndex = Array.from(
				tile.parentElement!.parentElement!.children,
			).indexOf(tile.parentElement!);
			const colIndex = Array.from(tile.parentElement!.children).indexOf(tile);
			selectedTileRef.current = [rowIndex, colIndex];
		} else {
			selectedTileRef.current = [-1, -1];
		}
	}

	function renderTile(rowIndex: number, colIndex: number) {
		const tileData = tiles.get(getTileKey(rowIndex, colIndex));
		return tileData ? (
			<div key={`${rowIndex},${colIndex}`} className="tile">
				{tileData.letter}
			</div>
		) : (
			<EmptyTile key={`${rowIndex},${colIndex}`} />
		);
	}

	return (
		<div className="tilemap-stage" onMouseMove={handleMouseMove}>
			<Draggable nodeRef={nodeRef} enableUserSelectHack cancel=".tile">
				<div ref={nodeRef} className="tilemap">
					{Array.from({ length: SIZE }).map((_, rowIndex) => (
						<div key={rowIndex} className="tile-row">
							{Array.from({ length: SIZE }).map((_, colIndex) =>
								renderTile(rowIndex, colIndex),
							)}
						</div>
					))}
				</div>
			</Draggable>
		</div>
	);
}

export default TileMap;
