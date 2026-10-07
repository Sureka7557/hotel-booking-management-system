import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // ✅ No hotelId here
  const handleReserved = () => {
    navigate("/reservations");
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        
         <div className="headerBrand">
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="brandName">LuxeStay</span>
        </Link>
        </div>

        <div className="navItems">
          {user ? (
            <>
              <span className="navUsername">{user.username}</span>

              {/* ✅ Reserved button */}
              <button className="navButton" onClick={handleReserved}>
                Reserved
              </button>

              <button className="navButton" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="navButton">Register</button>
              </Link>
              <Link to="/login">
                <button className="navButton">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;