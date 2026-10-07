import "./datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Datatable = ({ columns, type }) => {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        // ✅ Get token from localStorage user object
        const token = user?.token;

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        // ✅ Fix: rooms has no "get all" without hotel id on backend
        // So we use a known working endpoint per type
        let url = `http://localhost:8800/api/${type}`;

        const res = await axios.get(url, {
          withCredentials: true,
          headers,
        });

        setList(res.data);
      } catch (err) {
        console.error(`Failed to fetch ${type}:`, err.response?.status, err.message);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError(`Access denied. Make sure you are logged in as admin.`);
        } else if (err.response?.status === 404) {
          setError(`No ${type} found.`);
        } else {
          setError(`Failed to load ${type}.`);
        }
      }
    };

    fetchData();
  }, [type, user]);

  const handleDelete = async (id) => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(`http://localhost:8800/api/${type}/${id}`, {
        withCredentials: true,
        headers,
      });

      setList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/${type}/${params.row._id}`}>
            <div className="viewButton">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {type.charAt(0).toUpperCase() + type.slice(1)}
        <Link to={`/${type}/new`} className="link">
          Add New
        </Link>
      </div>

      {/* ✅ Show error banner instead of crashing */}
      {error ? (
        <div style={{
          padding: "20px",
          color: "#c0392b",
          background: "#fdecea",
          borderRadius: "8px",
          margin: "16px 0",
          fontFamily: "sans-serif",
          fontSize: "14px"
        }}>
          ⚠️ {error}
        </div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={list}
          columns={columns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      )}
    </div>
  );
};

export default Datatable;