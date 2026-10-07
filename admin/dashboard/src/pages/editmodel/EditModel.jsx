import "./editModel.css";
import { useState } from "react";
import axios from "axios";
import { useFetch } from "../../hooks/useFetch";

const EditModel = ({ data, type, id, setOpen }) => {
  const [formData, setFormData] = useState(data);
  const [rooms, setRooms] = useState(data.rooms || []);
  const [files, setFiles] = useState([]);

  const { data: roomsData, loading: roomsLoading } = useFetch("/rooms");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  const handleUpdate = async () => {
    try {
      let payload = {};

      if (type === "users") {
        payload = {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        };
      }

      if (type === "hotels") {
        // ✅ upload new images to Cloudinary (same as NewHotel)
        let photoUrls = formData.photos || [];

        if (files.length > 0) {
          photoUrls = await Promise.all(
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
        }

        payload = {
          name: formData.name,
          city: formData.city,
          address: formData.address,
          cheapestPrice: formData.cheapestPrice,
          rooms,
          photos: photoUrls,
        };
      }

      await axios.put(
        `http://localhost:8800/api/${type}/${id}`,
        payload,
        { withCredentials: true }
      );
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div className="editOverlay">
      <div className="editModal">
        <div className="editModal__header">
          <h2>Edit {type === "users" ? "user" : "hotel"}</h2>
          <button className="editModal__close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="editModal__body">

          {/* USER FIELDS */}
          {type === "users" && (
            <>
              <div className="editModal__field">
                <label>Username</label>
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>
              <div className="editModal__field">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div className="editModal__field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </div>
            </>
          )}

          {/* HOTEL FIELDS */}
          {type === "hotels" && (
            <>
              <div className="editModal__field">
                <label>Hotel name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Hotel Name"
                />
              </div>
              <div className="editModal__field">
                <label>City</label>
                <input
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div className="editModal__field">
                <label>Address</label>
                <input
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
              <div className="editModal__field">
                <label>Cheapest price</label>
                <input
                  name="cheapestPrice"
                  value={formData.cheapestPrice || ""}
                  onChange={handleChange}
                  placeholder="Price"
                  type="number"
                />
              </div>

              {/* ✅ IMAGE UPLOAD — same as NewHotel */}
              <div className="editModal__field">
                <label>Photos</label>

                {/* existing photos preview */}
                {formData.photos && formData.photos.length > 0 && files.length === 0 && (
                  <div className="editModal__previews">
                    {formData.photos.map((url, i) => (
                      <img key={i} src={url} alt="" className="editModal__preview" />
                    ))}
                  </div>
                )}

                {/* new files preview */}
                {files.length > 0 && (
                  <div className="editModal__previews">
                    {Array.from(files).map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="editModal__preview"
                      />
                    ))}
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="editModal__file"
                />
                <span className="editModal__hint">
                  Upload new photos to replace existing ones
                </span>
              </div>

              {/* ✅ ROOMS SELECT — same as NewHotel */}
              <div className="editModal__field">
                <label>Rooms</label>
                <select
                  multiple
                  className="editModal__select"
                  onChange={handleSelect}
                  defaultValue={rooms}
                >
                  {roomsLoading
                    ? <option disabled>Loading...</option>
                    : roomsData && roomsData.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
                <span className="editModal__hint">
                  Hold Ctrl / Cmd to select multiple
                </span>
              </div>
            </>
          )}

        </div>

        <div className="editModal__actions">
          <button className="editModal__btn editModal__btn--cancel" onClick={() => setOpen(false)}>Cancel</button>
          <button className="editModal__btn editModal__btn--update" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditModel;