import React from "react";
import "./Navigation.css"; 

interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export const Navigation: React.FC<Props> = ({ current, total, onPrev, onNext }) => {
  return (
    <div className="nav-container">
      <button className="nav-button" onClick={onPrev} disabled={current === 0}>
        Previous
      </button>
      <span className="nav-status">{current + 1} / {total}</span>
      <button className="nav-button" onClick={onNext} disabled={current === total - 1}>
        Next
      </button>
    </div>
  );
};
