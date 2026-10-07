import "./featured.css";
import LocalHotelOutlinedIcon from "@mui/icons-material/LocalHotelOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";

const Featured = () => {
  return (
    <div className="featured">

      <div className="top">
        <h1 className="title">Platform Highlights</h1>
      </div>

      <div className="featured-bottom">

        {/* CARD 1 */}
        <div className="highlightItem">
          <div className="iconContainer hotel">
            <LocalHotelOutlinedIcon className="icon" />
          </div>

          <div className="details">
            <span className="label">
              Most Booked Hotel
            </span>

            <span className="value">
              Royal Hotel
            </span>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="highlightItem">
          <div className="iconContainer room">
            <MeetingRoomOutlinedIcon className="icon" />
          </div>

          <div className="details">
            <span className="label">
              Most Popular Room
            </span>

            <span className="value">
              Deluxe Room
            </span>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="highlightItem">
          <div className="iconContainer booking">
            <EventAvailableOutlinedIcon className="icon" />
          </div>

          <div className="details">
            <span className="label">
              Peak Booking Day
            </span>

            <span className="value">
              Friday
            </span>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="highlightItem">
          <div className="iconContainer occupancy">
            <DonutLargeOutlinedIcon className="icon" />
          </div>

          <div className="details">
            <span className="label">
              Occupancy Rate
            </span>

            <span className="value">
              78%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Featured;