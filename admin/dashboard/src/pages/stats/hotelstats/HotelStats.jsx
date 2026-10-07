import "./hotelStats.css";
import { useFetch } from "../../../hooks/useFetch";

const HotelStats = ({ hotelId }) => {
  const { data, loading } = useFetch(
    `/hotels/hotelStats/${hotelId}`
  );

  if (loading) return "Loading...";

  return (
    <div className="hotelStats">
      <h2>Hotel Occupancy</h2>

      <div className="barContainer">
        <div
          className="barFill"
          style={{ width: `${data.occupancy}%` }}
        ></div>
      </div>

      <p>{data.occupancy}% Occupied</p>

      <div className="details-hotel">
        <span>Total Rooms: {data.totalRooms}</span>
        <span>Booked: {data.bookedRooms}</span>
      </div>
    </div>
  );
};

export default HotelStats;