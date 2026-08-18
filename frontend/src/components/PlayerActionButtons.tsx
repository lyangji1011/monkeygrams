import type { Socket } from "socket.io-client";
import type { RefObject } from "react";
import type { Tile } from "../../../shared/types/tile";

function PlayerActionButtons({
  socketRef,
  roomCode,
  tilesOnBoard,
}: {
  socketRef: RefObject<Socket | null>;
  roomCode: string | undefined;
  tilesOnBoard: Map<string, Tile>;
}) {

  function handlePeelAttempt() {
    const jsonMap = Object.fromEntries(tilesOnBoard);
    socketRef.current?.emit("peel", { tilesOnBoard: jsonMap, roomCode });
  }


  return (
    <div className="player-action-buttons">
      <div className="player-action-button" onClick={handlePeelAttempt}>PEEL</div>
      <div className="player-action-button disabled">BANANAS</div>
    </div>
  )

}

export default PlayerActionButtons