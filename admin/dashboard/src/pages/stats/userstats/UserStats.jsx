import "./userStats.css";
import { useFetch } from "../../../hooks/useFetch";

const UserStats = ({ userId }) => {
  const { data, loading } = useFetch(`/users/userStats/${userId}`);

  if (loading) return <div className="userStats"><h3>Loading...</h3></div>;

  return (
    <div className="userStats">
      <h2 className="statsTitle">User Analytics</h2>

      <div className="statsCards">
        
        {/* 1. Total Bookings (Navy Blue Gradient) */}
        <div className="statCard statCard--blue">
          <span className="statLabel">Total Bookings</span>
          <h2 className="statValue">{data.totalBookings}</h2>
        </div>

        {/* 2. Total Rooms (Gold Gradient) */}
        <div className="statCard statCard--gold">
          <span className="statLabel">Total Rooms</span>
          <h2 className="statValue">{data.totalRoomsBooked}</h2>
        </div>

        {/* 3. Last Booking (Red Gradient) */}
        <div className="statCard statCard--red">
          <span className="statLabel">Last Booking</span>
          <h2 className="statValue">
            {data.lastBooking
              ? new Date(data.lastBooking).toLocaleDateString()
              : "N/A"}
          </h2>
        </div>

      </div>
    </div>
  );
};

export default UserStats;