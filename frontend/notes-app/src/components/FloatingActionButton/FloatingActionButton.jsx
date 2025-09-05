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
    <div className="md:absolute md:bottom-20 md:left-1/2 md:transform md:-translate-x-1/2 md:z-40 md:w-full md:flex md:justify-center">
      <div className="mt-8 md:mt-0 flex flex-col items-center gap-4">
        {showProgressBar && <WeeklyProgressBar activityData={activityData} />}
        <button
          className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-black transition-all duration-200 cursor-pointer hover:glow-effect-green z-50 md:hidden ${className}`}
          onClick={onAddClick}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
