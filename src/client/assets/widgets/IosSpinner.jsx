import React from "react";
import { useEffect, useState } from "react";

const IosSpinner = ({ size = "1rem", color = "#fff" }) => {
  const spinnerStyle = {
    fontSize: size,
    position: "relative",
    display: "inline-block",
    width: size,
    height: size,
  };

  const bladeBaseStyle = {
    position: "absolute",
    left: "0.4629em",
    bottom: 0,
    width: "0.12em",
    height: "0.2777em",
    borderRadius: "0.5em",
    backgroundColor: "transparent",
    transformOrigin: "center -0.2222em",
    animation: "spinner-fade 1s infinite linear",
  };

  const delays = Array.from({ length: 8 }, (_, i) => ({
    animationDelay: `${i * 0.125}s`,
    transform: `rotate(${i * 45}deg)`,
  }));

  // Inject dynamic keyframes for the provided color
  useEffect(() => {
    const id = "ios-spinner-keyframes";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes spinner-fade {
        0% { background-color: ${color}; }
        100% { background-color: transparent; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [color]);

  return (
    <div style={spinnerStyle}>
      {delays.map((style, index) => (
        <div
          key={index}
          style={{
            ...bladeBaseStyle,
            ...style,
          }}
        />
      ))}
    </div>
  );
};

export default IosSpinner;
