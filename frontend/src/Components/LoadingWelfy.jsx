// LoadingWelfy.jsx
import { useEffect, useState } from "react";
import welfyOrigin from "../assets/images/welfy_origin.png";
import welfyNormal from "../assets/images/welfy_normal.png";

function useWelfySwap(interval) {
  const [showOrigin, setShowOrigin] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowOrigin((v) => !v), interval);
    return () => clearInterval(id);
  }, [interval]);

  return showOrigin ? welfyOrigin : welfyNormal;
}

export default function LoadingWelfy({ interval = 500 }) {
  const src = useWelfySwap(interval);
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
      <img
        src={src}
        alt="Welfy typing"
        style={{ width: 120, height: "auto", objectFit: "contain" }}
      />
    </div>
  );
}

export function LoadingWelfyAvatar({
  interval = 400,
  size = 55,
  className = "",
  style = {},
}) {
  const src = useWelfySwap(interval);
  return (
    <img
      src={src}
      alt="Welfy typing"
      className={className}
      style={{ width: size, height: "auto", objectFit: "contain", ...style }}
    />
  );
}
