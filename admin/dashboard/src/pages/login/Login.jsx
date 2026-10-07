import "./login.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { user, loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Redirect after login (correct place for hook)
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(
        "/api/auth/login", // keep slash for safety
        credentials,
        { withCredentials: true }
      );

      console.log("LOGIN RESPONSE:", res.data); // 🔍 debug
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res.data.isAdmin) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: res.data, // ✅ FIXED (no .details)
        });
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not allowed" },
        });
      }
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || { message: "Login failed" },
      });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2>Login</h2>

        {/* ✅ Wrap in form (fixes console warning too) */}
        <form onSubmit={handleClick}>
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
            className="lInput"
          />

          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="lInput"
          />

          <button
            disabled={loading}
            className="lButton"
            type="submit"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {error && (
          <span className="lError">
            {error.message || "Something went wrong"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Login;