import "./register.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [file, setFile] = useState(null); // ✅ image
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let photoUrl = "";

      // ✅ 1. Upload image to Cloudinary
      if (file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload"); // your preset

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dnkkxdwjt/image/upload",
          data
        );

        photoUrl = uploadRes.data.url;
      }

      // ✅ 2. Send all data to backend
      await axios.post(
        "/api/auth/register",
        {
          ...credentials,
          img: photoUrl,
        },
        { withCredentials: true }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data || { message: "Register failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2>Register</h2>

        <form onSubmit={handleClick}>
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
            className="lInput"
          />

          <input
            type="email"
            placeholder="Email"
            id="email"
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

          {/* ✅ NEW: PHONE */}
          <input
            type="text"
            placeholder="Phone Number"
            id="phone"
            onChange={handleChange}
            className="lInput"
          />

          {/* ✅ NEW: IMAGE */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="lInput"
          />

          <button disabled={loading} className="lButton" type="submit">
            {loading ? "Creating..." : "Register"}
          </button>
          <p className="registerLink">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
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

export default Register;