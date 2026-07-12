function HomePageButtons() {

  function typeRoomCode(event: React.ChangeEvent<HTMLInputElement>) {
    const roomCode = event.target.value.toUpperCase();
    event.target.value = roomCode;
  }

  return (
    <div>
      <div className="join-room">
        <input type="text" placeholder="Room Code" maxLength={4} onChange={typeRoomCode} />
        <button>Join</button>
      </div>
      <div className="create-room">
        <button>Create Room</button>
      </div>
    </div>
  )
}

export default HomePageButtons
