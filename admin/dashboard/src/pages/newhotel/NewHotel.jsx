import "./newhotel.css";
import { useState } from "react";
import axios from "axios";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
const NewHotel = () => {
  const [info, setInfo] = useState({});
  const [files, setFiles] = useState([]);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const { data, loading } = useFetch("/rooms");

  const handleChange = (e) => {
    setInfo((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  const handleClick = async (e) => {
  e.preventDefault();

  try {
    const list = await Promise.all(
      Object.values(files).map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dnkkxdwjt/image/upload",
          data
        );

        return res.data.url;
      })
    );

    const newHotel = {
      ...info,
      photos: list,
      rooms,
    };

    await axios.post(
      "http://localhost:8800/api/hotels",
      newHotel,
      { withCredentials: true }
    );

  
    navigate("/hotels");

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Error creating hotel");
  }
};

  return (
    <div className="newHotel">
      <div className="container">
        <h1>Add New Hotel</h1>

        <div className="form">

       
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />

      
          <div style={{ display: "flex", gap: "10px" }}>
            {files &&
              Array.from(files).map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt=""
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              ))}
          </div>

          <input id="name" placeholder="Name" onChange={handleChange} />
          <input id="type" placeholder="Type" onChange={handleChange} />
          <input id="city" placeholder="City" onChange={handleChange} />
          <input id="address" placeholder="Address" onChange={handleChange} />
          <input id="distance" placeholder="Distance" onChange={handleChange} />
          <input id="desc" placeholder="Description" onChange={handleChange} />

   
          <input
            id="cheapestPrice"
            type="number"
            placeholder="Price"
            onChange={handleChange}
          />

          <select multiple onChange={handleSelect}>
            {loading
              ? "loading..."
              : data &&
                data.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.title}
                  </option>
                ))}
          </select>

          <button onClick={handleClick}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;