import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
// import About from "../../components/about/About";
import Footer from "../../components/footer/Footer";
import Reserve from "../../components/reserve/Reserve";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useFetch from "../../hooks/useFetch";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext";

const Hotel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[2];

  // API CALL
  const { data, loading, error } = useFetch(
    `/api/hotels/find/${id}`
  );

  const { dates, options } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

 
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  let days = 1;

  if (dates && dates.length > 0) {
    const start = new Date(dates[0].startDate);
    const end = new Date(dates[0].endDate);

    if (!isNaN(start) && !isNaN(end)) {
      const diffTime = end.getTime() - start.getTime();
      days = Math.ceil(diffTime / MILLISECONDS_PER_DAY);
    }
  }
  console.log(data?.cheapestPrice)
  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    if (!data?.photos || data.photos.length === 0) return;

    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber =
        slideNumber === 0
          ? data.photos.length - 1
          : slideNumber - 1;
    } else {
      newSlideNumber =
        slideNumber === data.photos.length - 1
          ? 0
          : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const handleReserve = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />

      {loading ? (
        "Loading..."
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="hotelContainer">

          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />

              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />

              <div className="sliderWrapper">
                <img
                  src={data.photos?.[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>

              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

          <div className="hotelWrapper">

            <button
              className="bookNow"
              onClick={handleReserve}
            >
              Reserve or Book Now!
            </button>

            <h1 className="hotelTitle">{data.name}</h1>

            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>

            <span className="hotelDistance">
              {data.distance} from center
            </span>

            <span className="hotelPriceHighlight">
              Book a stay from ${data?.cheapestPrice}
            </span>

            
            <div className="hotelImages">
              {data.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>

          
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1>Stay in the heart of the city</h1>
                <p className="hotelDesc">{data.desc}</p>
              </div>

             
              <div className="hotelDetailsPrice">
                <h1>Perfect for your stay!</h1>

                <span>
                  Located in the heart of the city with excellent access.
                </span>

                <h2>
                  <b>
                    $
                    {(days || 1) *
                      (data?.cheapestPrice || 0) *
                      (options?.room || 1)}
                  </b>{" "}
                  ({days || 1} nights)
                </h2>

                {/* BOTTOM BUTTON */}
                <button onClick={handleReserve}>
                  Reserve or Book Now!
                </button>
              </div>
            </div>
          </div>

          {/* 🔥 RESERVE MODAL */}
          {openModal && (
            <Reserve setOpen={setOpenModal} hotelId={id} />
          )}

          
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Hotel;