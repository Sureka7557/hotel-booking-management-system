import "./chart.css";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {useFetch} from "../../hooks/useFetch";

const Chart = ({ aspect, title }) => {

  const { data, loading } =
    useFetch("/bookings/monthlyStats");

  return (
    <div className="chart">

      <div className="title">{title}</div>

      {loading ? (
        "Loading..."
      ) : (
        <ResponsiveContainer
          width="100%"
          aspect={aspect}
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="total"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#7451f8"
                  stopOpacity={0.8}
                />

                <stop
                  offset="95%"
                  stopColor="#7451f8"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="gray"
            />

            <CartesianGrid
              strokeDasharray="3 3"
              className="chartGrid"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="Total"
              stroke="#7451f8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;