import "./searchItem.css";
import { useNavigate } from "react-router-dom";

const SearchItem = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(item); // 👈 log hotel data
    navigate(`/hotels/${item._id}`); // 👈 go to details page
  };

  return (
    <div className="searchItem">
      <img
        src={
          item.photos && item.photos.length > 0
            ? item.photos[0]
            : "https://cf.bstatic.com/xdata/images/hotel/square600/261707778.webp"
        }
        alt=""
        className="siImg"
      />

      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">{item.distance} from center</span>
        <span className="siTaxiOp">Free airport taxi</span>

        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>

        <span className="siFeatures">
          Entire studio • 1 bathroom • 21m² 1 full bed
        </span>

        <span className="siCancelOp">Free cancellation</span>

        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>

      <div className="siDetails">
        {item.rating && (
          <div className="siRating">
            <span>Excellent</span>
            <button>{item.rating}</button>
          </div>
        )}

        <div className="siDetailTexts">
          <span className="siPrice">${item.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>

          <button className="siCheckButton" onClick={handleClick}>
            See availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;