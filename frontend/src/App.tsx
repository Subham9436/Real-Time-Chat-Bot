import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { useAuthStore } from "./store/authstore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth,isCheckingauthUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);
  console.log(authUser);

  if(isCheckingauthUser && !authUser){
    return <div className="flex-center h-screen">
      <Loader className="size-10 animate-spin"></Loader>
    </div>
  }
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login"></Navigate>}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/"></Navigate>}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/"></Navigate>}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profilepage"
          element={authUser ? <Profile /> : <Navigate to="/login"></Navigate>}
        />
      </Routes>
    </div>
  );
}

export default App;
