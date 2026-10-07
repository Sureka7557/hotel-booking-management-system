export const userColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "img",
  headerName: "Image",
  width: 100,
  renderCell: (params) => {
    return (
      <div className="cellWithImg">
        <img
  className="cellImg"
  src={
    params.row.img &&
    params.row.img.startsWith("http")
      ? params.row.img
      : "https://i.ibb.co/4pDNDk1/avatar.png"
  }
  alt=""
  onError={(e) => {
    e.target.src = "https://i.ibb.co/4pDNDk1/avatar.png";
  }}
/>
      </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
    {
    field: "phone",
    headerName: "Phone Number",
    width: 150,
  },

];
export const roomColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "title",
    headerName: "Title",
    width: 230,
  },
  {
    field: "desc",
    headerName: "Description",
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Max People",
    width: 100,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 220 },
 {
  field: "photos",
  headerName: "Image",
  width: 100,
  renderCell: (params) => (
    <img
      src={
        params.row.photos?.[0] ||
        "https://i.ibb.co/4pDNDk1/avatar.png"
      }
      alt=""
      style={{ width: 40, height: 40, borderRadius: "50%" }}
    />
  ),
},
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "type",
    headerName: "Type",
    width: 120,
  },
  {
    field: "city",
    headerName: "City",
    width: 120,
  },
  {
    field: "distance",
    headerName: "Distance",
    width: 120,
  },
  {
    field: "cheapestPrice", // ✅ FIXED (was price)
    headerName: "Price",
    width: 120,
  },
  {
    field: "featured",
    headerName: "Featured",
    width: 100,
    renderCell: (params) => (
      <span>{params.row.featured ? "Yes" : "No"}</span>
    ),
  },
];