import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePageButtons() {
  const navigate = useNavigate();
	const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom() {
		try {
			const response = await fetch("/api/rooms", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to create room");
			}

			const data = await response.json();
			setRoomCode(data.code);
      navigate(`/rooms/${data.code}`, {
        state: { name: data.username },
      })
		} catch (error) {
			console.error(error);
		}
	}

  function typeRoomCode(event: React.ChangeEvent<HTMLInputElement>) {
    const upperCaseRoomCode = event.target.value.toUpperCase();
    event.target.value = upperCaseRoomCode;
    setRoomCode(upperCaseRoomCode);
  }

  return (
    <div>
      <div className="join-room">
        <input type="text" placeholder="Room Code" maxLength={6} onChange={typeRoomCode} />
        <button>Join</button>
      </div>
      or
      <div className="create-room">
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
    </div>
  )
}

export default HomePageButtons;
