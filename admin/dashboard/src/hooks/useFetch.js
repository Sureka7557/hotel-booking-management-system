import { useState, useEffect } from "react";
import axios from "axios";

export const useFetch = (url) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api" + url,
          {
            withCredentials: true, // ✅ THIS FIXES 403
          }
        );
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [url]);

  return { data };
};