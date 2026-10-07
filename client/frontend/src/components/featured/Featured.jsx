import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/api/hotels/countByCity?cities=mumbai,seoul,goa"
  );

  const cities = [
  {
    name: "Mumbai",
    img: "https://i.pinimg.com/736x/be/55/31/be5531a2ca52ecacf16abb82f5f8c45d.jpg",
  },
  {
    name: "Seoul",
    img: "https://i.pinimg.com/736x/15/d8/75/15d87575174474d05147fbaf61144802.jpg",
  },
  {
    name: "Goa",
    img: "https://i.pinimg.com/1200x/3d/6a/40/3d6a40cab194cdf383c4139f43d959d9.jpg",
  }]
  return (
    <div className="featured">
      {loading ? (
        "Loading..."
      ) : (
        <>
         {cities.map((city, i) => (
  <div className="featuredItem" key={city.name}>
    <img src={city.img} alt="" className="featuredImg" />
    <div className="featuredTitles">
      <h1>{city.name}</h1>
      <h2>{data[i]} properties</h2>
    </div>
  </div>
))}
        </>
      )}
    </div>
  );
};

export default Featured;