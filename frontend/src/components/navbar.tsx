import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const handleClick = (tab: number) => {
    let path = "";

    switch (tab) {
      case 1:
        path = "signin";
        break;
      case 2:
        path = "signup";
        break;
      case 3:
        path = "about";
        break;
      case 4:
        path = "services";
        break;
      case 5:
        path = "";
        break;
      default:
        path = "/";
    }
    navigate(`/${path}`);
  };
  useGSAP(() => {
    const navTween = gsap.timeline({
      scrollTrigger: {
        trigger: "nav",
        start: "bottom top",
      },
    });
    navTween.fromTo(
      "nav",
      {
        backgroundColor: "transparent",
      },
      {
        backgroundColor: "#00000050",
        backdropFilter: "blur(10px)",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  }, []);

  return (
    <nav id="nav">
      <div className="flex justify-between p-4 md:flex-row flex-col items-center">
        <div
          className="flex-center"
          onClick={() => handleClick(5)}
          style={{ cursor: "pointer" }}
        >
          <img
            src="./img/2024-logo-design-trend-geometric-shapes-and-abstract-imagery-kreafolk_c561928f-f820-4187-9377-daf5d26ee249-removebg-preview.png"
            className=" w-37 h-23"
          ></img>
          <p>ChatterBox</p>
        </div>
        <div className="flex flex-row space-x-5" style={{ cursor: "pointer" }}>
          <h3 onClick={() => handleClick(1)}>Sign-in</h3>
          <h3 onClick={() => handleClick(2)}>Sign-Up</h3>
          <h3 onClick={() => handleClick(3)}>About</h3>
          <h3 onClick={() => handleClick(4)}>Services</h3>
        </div>
      </div>
    </nav>
  );
}
