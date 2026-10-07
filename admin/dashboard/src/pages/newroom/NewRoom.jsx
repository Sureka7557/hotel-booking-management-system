import "./newroom.css";
import { useState } from "react";
import axios from "axios";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [roomNumbers, setRoomNumbers] = useState("");
  const [hotelId, setHotelId] = useState("");
  const navigate = useNavigate();
  const { data, loading } = useFetch("/hotels/all");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

 const handleClick = async (e) => {
  e.preventDefault();

  try {
    const rooms = roomNumbers
      .split(",")
      .map((room) => ({
        number: parseInt(room.trim()),
      }));

    await axios.post(
      "http://localhost:8800/api/rooms/" + hotelId,
      {
        ...info,
        roomNumbers: rooms,
      },
      { withCredentials: true }
    );

    alert("Room created successfully!");
     navigate("/rooms");
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

  return (
    <div className="newRoom">
      <div className="container">
        <h1>Add New Room</h1>

        <div className="form">
          <input
            id="title"
            placeholder="Title"
            onChange={handleChange}
          />

          <input
            id="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
          />

          <input
            id="maxPeople"
            type="number"
            placeholder="Max People"
            onChange={handleChange}
          />

          <input
            id="desc"
            placeholder="Description"
            onChange={handleChange}
          />

         
              <textarea
          placeholder="give comma between room numbers."
          onChange={(e) => setRoomNumbers(e.target.value)}
        />

         
          <select onChange={(e) => setHotelId(e.target.value)}>
            <option>Select Hotel</option>
            {loading
              ? "loading..."
              : data &&
                data.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
          </select>

          <button onClick={handleClick}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;