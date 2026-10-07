import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewRoom from "./pages/newroom/NewRoom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.css";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext"
import { Navigate } from "react-router-dom";
import { hotelColumns, userColumns,roomColumns } from "./datatablesource";
import NewHotel from "./pages/newhotel/NewHotel";
function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
    <Route path="/">
  {/* HOME */}
  <Route
    index
    element={
      <ProtectRoute>
        <Home />
      </ProtectRoute>
    }
  />

  <Route path="login" element={<Login />} />

  {/* USERS */}
  <Route path="users">
    <Route
      index
      element={
        <ProtectRoute>
          <List columns={userColumns} type="users" />
        </ProtectRoute>
      }
    />
    <Route
      path=":userId"
      element={
        <ProtectRoute>
          <Single type="users" />
        </ProtectRoute>
      }
    />
    <Route
      path="new"
      element={
        <ProtectRoute>
          <New inputs={userInputs} title="Add New User" />
        </ProtectRoute>
      }
    />
  </Route>

  {/* HOTELS */}
  <Route path="hotels">
    <Route
      index
      element={
        <ProtectRoute>
          <List columns={hotelColumns} type="hotels" />
        </ProtectRoute>
      }
    />
    <Route
      path=":hotelId"
      element={
        <ProtectRoute>
          <Single type="hotels" />
        </ProtectRoute>
      }
    />
    <Route
      path="new"
      element={
        <ProtectRoute>
          <NewHotel />
        </ProtectRoute>
      }
    />
  </Route>

  {/* ✅ ROOMS (MOVE HERE) */}
  <Route path="rooms">
    <Route
      index
      element={
        <ProtectRoute>
          <List columns={roomColumns} type="rooms" />
        </ProtectRoute>
      }
    />
    <Route
      path=":roomId"
      element={
        <ProtectRoute>
         <Single type="rooms" />
        </ProtectRoute>
      }
    />
    <Route
  path="new"
  element={
    <ProtectRoute>
      <NewRoom />
    </ProtectRoute>
  }
/>
  </Route>
</Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
