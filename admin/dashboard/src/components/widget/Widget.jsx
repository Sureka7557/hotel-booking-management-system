import "./widget.css";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useFetch } from "../../hooks/useFetch";

const Widget = ({ type }) => {
  let data;

  // FETCH REAL DATA
  const { data: users } = useFetch("/users");
  const { data: hotels } = useFetch("/hotels");
  const { data: rooms } = useFetch("/rooms");
  const { data: bookings } = useFetch("/bookings");

  switch (type) {
    case "user":
      data = {
        title: "TOTAL USERS",

        count: users?.length || 0,

        subtitle: "Registered users",

        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255,0,0,0.15)",
            }}
          />
        ),
      };
      break;

    case "hotel":
      data = {
        title: "TOTAL HOTELS",

        count: hotels?.length || 0,

        subtitle: "Hotels available",

        icon: (
          <HotelOutlinedIcon
            className="icon"
            style={{
              color: "#1e88e5",
              backgroundColor: "rgba(30,136,229,0.15)",
            }}
          />
        ),
      };
      break;

    case "room":
      data = {
        title: "TOTAL ROOMS",

        count: rooms?.length || 0,

        subtitle: "Rooms listed",

        icon: (
          <MeetingRoomOutlinedIcon
            className="icon"
            style={{
              color: "green",
              backgroundColor: "rgba(0,128,0,0.15)",
            }}
          />
        ),
      };
      break;

    case "booking":
      data = {
        title: "TOTAL BOOKINGS",

        count: bookings?.length || 0,

        subtitle: "Bookings completed",

        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{
              color: "purple",
              backgroundColor: "rgba(128,0,128,0.15)",
            }}
          />
        ),
      };
      break;

    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>

        <span className="counter">{data.count}</span>

        <span className="subtitle">{data.subtitle}</span>
      </div>

      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;