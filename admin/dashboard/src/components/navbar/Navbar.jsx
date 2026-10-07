import "./navbar.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdOutlineHotelClass } from "react-icons/md";
const Navbar = () => {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }
  return (
    <div className="navbar">
      <div className="wrapper">

        {/* LEFT → SLOGAN */}
        <div className="logo">
          <span className="slogan">
            <MdOutlineManageAccounts className="sloganIcon" />
            Manage smarter, faster 
          </span>
        </div>

         <div className="right">
          <span className="greeting">
          <MdOutlineHotelClass className="adminIcon" />
          {greeting}, Admin
        </span>
        </div>

      </div>
    </div>
  );
};

export default Navbar;