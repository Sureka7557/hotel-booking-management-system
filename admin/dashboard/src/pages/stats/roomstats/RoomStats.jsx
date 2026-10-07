import "./roomStats.css";
import { useFetch } from "../../../hooks/useFetch";
import { MdTrendingUp, MdTrendingDown, MdOutlineMeetingRoom } from "react-icons/md";
import { SiBookalope } from "react-icons/si";

const RoomStats = ({ roomId }) => {
  const { data, loading } = useFetch(`/rooms/roomStats/${roomId}`);

  if (loading) return <p>Loading stats...</p>;
  if (!data) return null;

  return (
    <div className="roomStats">
      <h2>Room Analytics</h2>

      <div className="room_statsGrid">
        {/* Bookings: SiBookalope */}
        <div className="room_statCard room_statCard--blue">
          <SiBookalope className="room_statIcon" />
          <h3>Bookings</h3>
          <p>{data.bookedSlots ?? data.bookings}</p>
        </div>

        {/* Total Rooms: MdOutlineMeetingRoom */}
        <div className="room_statCard room_statCard--navy">
          <MdOutlineMeetingRoom className="room_statIcon" />
          <h3>Total Rooms</h3>
          <p>{data.totalRooms}</p>
        </div>

        {/* Profit: MdTrendingUp */}
        <div className="room_statCard room_statCard--green">
          <MdTrendingUp className="room_statIcon" />
          <h3>Profit</h3>
          <p>₹{data.profit?.toLocaleString("en-IN")}</p>
        </div>

        {/* Loss: MdTrendingDown */}
        <div className="room_statCard room_statCard--red">
          <MdTrendingDown className="room_statIcon" />
          <h3>Loss</h3>
          <p>₹{data.loss?.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomStats;