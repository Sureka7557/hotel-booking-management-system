import "./single.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useState } from "react";
import EditModal from "../editmodel/EditModel";
import RoomStats from "../stats/roomstats/RoomStats";
import HotelStats from "../stats/hotelstats/HotelStats";
import UserStats from "../stats/userstats/UserStats";

const Single = ({ type }) => {
  const { userId, hotelId, roomId } = useParams();
  const id = userId || hotelId || roomId;

  const [openEdit, setOpenEdit] = useState(false);

  let url = null;
  if (type === "users") url = `/users/${id}`;
  if (type === "hotels") url = `/hotels/find/${id}`; // ✅ FIXED
  if (type === "rooms") url = `/rooms/${id}`;

  const { data, loading } = useFetch(url);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        {loading ? (
          <h1 style={{ padding: "20px" }}>Loading...</h1>
        ) : (
          <>
            <div className="top">
              <div className="left">
                {type !== "rooms" && (
  <div
    className="editButton"
    onClick={() => setOpenEdit(true)}
  >
    Edit
  </div>
)}

                <h1 className="title">Information</h1>

                <div className="item">
                  <img
  src={
    type === "users"
      ? data.img || "https://i.ibb.co/4pDNDk1/avatar.png"
      : type === "hotels"
      ? data.photos?.[0] ||
        "https://i.ibb.co/4pDNDk1/avatar.png"
      : "https://i.pinimg.com/webp70/736x/69/85/1f/69851f1eefe8a7ace29395295b1ec82f.webp"
  }
  alt=""
  className="itemImg"
/>
<div className="details">
  <h3 className="itemTitle">
    {type === "users" && data.username}
    {type === "hotels" && data.name}
    {type === "rooms" && data.title}
  </h3>

  {/* USERS */}
  {type === "users" && (
    <>
      <div className="detailItem">
        <span className="itemKey">Email:</span>
        <span className="itemValue">{data.email}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Phone:</span>
        <span className="itemValue">{data.phone}</span>
      </div>
    </>
  )}

  {/* HOTELS */}
  {type === "hotels" && (
    <>
      <div className="detailItem">
        <span className="itemKey">City:</span>
        <span className="itemValue">{data.city}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Address:</span>
        <span className="itemValue">{data.address}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Price:</span>
        <span className="itemValue">₹{data.cheapestPrice}</span>
      </div>
    </>
  )}

  {/* ROOMS */}
  {type === "rooms" && (
    <>
      <div className="detailItem">
        <span className="itemKey">Price:</span>
        <span className="itemValue">₹{data.price}</span>
      </div>
      <div className="detailItem">
        <span className="itemKey">Max People:</span>
        <span className="itemValue">{data.maxPeople}</span>
      </div>
    </>
  )}
</div>
                </div>
              </div>

              <div className="right">
            {type === "rooms" && <RoomStats roomId={id} />}

            {type === "hotels" && (
              <HotelStats hotelId={id} />
            )}

            {type === "users" && (
              <UserStats userId={id} />
            )}
          </div>
            </div>

            {/* ✅ MODAL */}
            {openEdit && (
              <EditModal
                data={data}
                type={type}
                id={id}
                setOpen={setOpenEdit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Single;