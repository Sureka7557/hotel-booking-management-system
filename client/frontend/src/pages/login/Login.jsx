import "./login.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

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
        "api/auth/login",
        credentials,
        { withCredentials: true }
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response.data,
      });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2>Login</h2>

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
          onClick={handleClick}
          className="lButton"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <p className="registerLink">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
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