import React from "react";
import "./Navigation.css";

interface Props {
  slides: any[];
  handleClick: (index: number) => void;
}

export const Navigation: React.FC<Props> = ({ slides, handleClick }) => {
  return (
    <div className="nav-container">
      {slides.map((slide, index) => (
        <div
          className="slide-wrap"
          key={index}
          onClick={() => handleClick(index)}
        >
          <span> {slide.content}</span>
        </div>
      ))}
    </div>
  );
};
