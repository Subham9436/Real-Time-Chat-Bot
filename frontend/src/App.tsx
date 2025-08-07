import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/navbar";
import { Home } from "./components/Home";
import { Signup } from "./components/signup";
import { Signin } from "./components/signin";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {
  return (
    <main>
      <Navbar />
      <div className="pt-60 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
