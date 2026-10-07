import "./reservations.css";
import Navbar from "../navbar/Navbar";
import Header from "../header/Header";
import useFetch from "../../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { MdLocationPin } from "react-icons/md";

const Reservations = () => {
  const { user } = useContext(AuthContext);

  const { data, loading } = useFetch(
    user ? `/api/bookings/${user._id}` : null
  );

  const [hotelData, setHotelData] = useState({});

 // ✅ FIX DATE LOGIC HERE
const getCheckInOut = (dates) => {
  if (!dates || dates.length === 0) {
    return { checkIn: "—", checkOut: "—", nights: 0 };
  }

  const sorted = [...dates].map(Number).sort((a, b) => a - b);

  const format = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return {
    checkIn: format(sorted[0]), // ✅ FIRST DATE
    checkOut: format(sorted[sorted.length - 1]), // ✅ LAST DATE
    nights: sorted.length,
  };
};

  // ✅ Fetch hotel names for each booking
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const map = {};
        for (let booking of data || []) {
          if (!map[booking.hotelId]) {
            const res = await axios.get(`/api/hotels/find/${booking.hotelId}`);
            map[booking.hotelId] = res.data;
          }
        }
        setHotelData(map);
      } catch (err) {
        console.error(err);
      }
    };

    if (data?.length > 0) fetchHotels();
  }, [data]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      window.location.reload();
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  if (!user) {
    return (
      <div>
        <Navbar />
        <Header type="list" />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Please login to view your reservations
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />

      <div className="reservationsContainer">
        <h2 className="resTitle">Your Reservations</h2>

        {loading ? (
          <p className="resLoading">Loading your bookings...</p>
        ) : !data || data.length === 0 ? (
          <p className="resEmpty">No reservations found.</p>
        ) : (
          <div className="resList">
            {data.map((booking) => {
              const hotel = hotelData[booking.hotelId];
              const { checkIn, checkOut, nights } = getCheckInOut(booking.dates);

              return (
                <div className="reservationCard" key={booking._id}>
                  {/* Left accent bar */}
                  <div className="cardAccent" />

                  <div className="cardContent">
                    {/* Hotel name + city */}
                    <div className="cardHeader">
                      <div>
                        <span className="cardLabel">HOTEL</span>
                        <h3 className="cardHotelName">
                          {hotel?.name || "Loading..."}
                        </h3>
                        {hotel?.city && (
                    <p className="cardCity">
                      <MdLocationPin className="cityLocationIcon" />
                      {hotel.city}
                    </p>                        )}
                      </div>
                      <div className="nightsBadge">
                        {nights} night{nights > 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="cardDivider" />

                    {/* Rooms */}
                    <div className="cardRow">
                      <span className="cardLabel">ROOMS</span>
                      <div className="roomPills">
                        {(booking.roomNumbers || []).map((num, i) => (
                          <span className="roomPill" key={i}>
                            #{num}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ✅ FIXED: Show actual check-in / check-out dates */}
                    <div className="cardDates">
                      <div className="dateBlock">
                        <span className="cardLabel">CHECK-IN</span>
                        <span className="dateValue">{checkIn}</span>
                      </div>
                      <div className="dateArrow">→</div>
                      <div className="dateBlock dateBlockRight">
                        <span className="cardLabel">CHECK-OUT</span>
                        <span className="dateValue">{checkOut}</span>
                      </div>
                    </div>

                    {/* Cancel button */}
                    <button
                      className="cancelBtn"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;