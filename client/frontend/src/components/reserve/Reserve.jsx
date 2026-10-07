import "./reserve.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Reserve = ({ setOpen, hotelId }) => {
  const { data, loading } = useFetch(`/api/rooms/hotel/${hotelId}`);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const toDateKey = (val) => {
    const d = new Date(Number(val));
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getDatesInRange = (startDate, endDate) => {
    const keys = new Set();
    const current = new Date(
      Date.UTC(
        new Date(startDate).getFullYear(),
        new Date(startDate).getMonth(),
        new Date(startDate).getDate()
      )
    );
    const endUTC = new Date(
      Date.UTC(
        new Date(endDate).getFullYear(),
        new Date(endDate).getMonth(),
        new Date(endDate).getDate()
      )
    );
    while (current <= endUTC) {
      keys.add(
        `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, "0")}-${String(current.getUTCDate()).padStart(2, "0")}`
      );
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return keys;
  };

  const getAllDatesAsNumbers = (startDate, endDate) => {
    const list = [];
    const current = new Date(
      Date.UTC(
        new Date(startDate).getFullYear(),
        new Date(startDate).getMonth(),
        new Date(startDate).getDate()
      )
    );
    const endUTC = new Date(
      Date.UTC(
        new Date(endDate).getFullYear(),
        new Date(endDate).getMonth(),
        new Date(endDate).getDate()
      )
    );
    while (current <= endUTC) {
      list.push(current.getTime());
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return list;
  };

  const selectedDateKeys =
    dates?.length > 0
      ? getDatesInRange(dates[0].startDate, dates[0].endDate)
      : new Set();

  const allDates =
    dates?.length > 0
      ? getAllDatesAsNumbers(dates[0].startDate, dates[0].endDate)
      : [];

  // Handles Date objects, timestamps, and ISO strings
  const isAvailable = (roomNumber) => {
    if (!roomNumber?.unavailableDates?.length) return true;

    return !roomNumber.unavailableDates.some((storedDate) => {
      let key;
      if (storedDate instanceof Date) {
        key = `${storedDate.getUTCFullYear()}-${String(storedDate.getUTCMonth() + 1).padStart(2, "0")}-${String(storedDate.getUTCDate()).padStart(2, "0")}`;
      } else if (typeof storedDate === "string" && storedDate.includes("T")) {
        const d = new Date(storedDate);
        key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      } else {
        key = toDateKey(storedDate);
      }
      return selectedDateKeys.has(key);
    });
  };

  const handleSelect = (e, id) => {
    const checked = e.target.checked;
    setBookingError(null);
    setSelectedRooms((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleClick = async () => {
    if (!user) return alert("Please login first");
    if (selectedRooms.length === 0) return alert("Select at least one room");

    setBookingLoading(true);
    setBookingError(null);

    try {
      await axios.post("/api/bookings", {
        userId: user._id,
        hotelId,
        roomIds: selectedRooms,
        dates: allDates,
      });

      alert("Reservation successful ✅");
      setOpen(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Booking failed. Please try again.";
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        <span className="rTitleMain">Select your rooms:</span>

        {bookingError && (
          <div style={{
            background: "#fdecea",
            color: "#c0392b",
            padding: "10px 14px",
            borderRadius: "8px",
            marginBottom: "12px",
            fontSize: "14px",
          }}>
            ⚠️ {bookingError}
          </div>
        )}

        {loading ? (
          <p>Loading rooms...</p>
        ) : !data || data.length === 0 ? (
          <div className="noRooms">❌ No rooms found for this hotel</div>
        ) : (
          data?.filter(Boolean).map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title}</div>
                <div className="rDesc">{item.desc}</div>
                <div className="rPrice">${item.price}</div>
              </div>

              <div className="rSelectRooms">
                {item.roomNumbers.map((roomNumber) => {
                  const available = isAvailable(roomNumber);
                  return (
                    <div
                      className="room"
                      key={roomNumber._id}
                      style={{
                        opacity: available ? 1 : 0.5,
                        // Removed pointerEvents: "none" so that cursor style is visible
                        cursor: available ? "pointer" : "not-allowed",
                      }}
                    >
                      <label style={{ color: available ? "#333" : "#ffffff", cursor: available ? "pointer" : "not-allowed" }}>
                        Room {roomNumber.number}
                        {!available && (
                          <span style={{
                            marginLeft: "6px",
                            fontSize: "11px",
                            color: "#e99b93",
                            fontWeight: 600,
                          }}>
                            (Booked)
                          </span>
                        )}
                      </label>
                      <input
                        type="checkbox"
                        disabled={!available}
                        checked={selectedRooms.includes(roomNumber._id)}
                        onChange={(e) => handleSelect(e, roomNumber._id)}
                        style={{ cursor: available ? "pointer" : "not-allowed" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <button
          className="rButton"
          onClick={handleClick}
          disabled={selectedRooms.length === 0 || bookingLoading}
        >
          {bookingLoading ? "Booking..." : "Reserve Now!"}
        </button>
      </div>
    </div>
  );
};

export default Reserve;