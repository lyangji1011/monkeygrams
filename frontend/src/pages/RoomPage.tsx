import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchAndSetUsername = async() => {
      console.log("hi")
      const response = await fetch("/api/names", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomCode: roomCode })
      });
      const data = await response.json();
      if (!response.ok) {
        navigate("/");
        return;
      }
      console.log('new user ' + data.username);
      setUsername(data.username);
    }

    const stateName = location.state?.name;
    if (stateName) {
      setUsername(stateName);
      console.log(stateName);
    } else {
      fetchAndSetUsername();
    }
  }, [])

  return (
    <div> room</div>
  )
}