import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function Home() {
  const textRef = useRef<HTMLDivElement>(null);
  let xPercent = 0;
  useGSAP(() => {
    gsap.to(textRef.current, {
      xPercent: -100, // move it fully to the left
      duration: 10, // speed of scroll
      ease: "none", // no easing for continuous loop
      repeat: -1, // infinite
    });
  }, []);

  return <div className="text-white noisy flex-center"></div>;
}
