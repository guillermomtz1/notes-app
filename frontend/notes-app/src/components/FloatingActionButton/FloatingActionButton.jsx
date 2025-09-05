import React from "react";
import { MdAdd } from "react-icons/md";
import WeeklyProgressBar from "../WeeklyProgressBar/WeeklyProgressBar";

const FloatingActionButton = ({
  isVisible = true,
  onAddClick,
  activityData = [],
  showProgressBar = true,
  className = "",
}) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center w-full mt-8">
      <div className="flex flex-row items-center gap-2">
        {showProgressBar && <WeeklyProgressBar activityData={activityData} />}
        <button
          className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-secondary hover:bg-secondary-dark text-black transition-all duration-200 cursor-pointer hover:glow-effect-bright-green z-50 ${className}`}
          onClick={onAddClick}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
