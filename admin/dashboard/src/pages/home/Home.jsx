import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.css";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";


const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="hotel" />
          <Widget type="room" />
          <Widget type="booking" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Bookings per month" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default Home;
