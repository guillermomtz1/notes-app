import React from "react";

const WeeklyProgressBar = ({ activityData = [] }) => {
  // Generate weeks for the current year (52 weeks)
  const generateWeeks = () => {
    const weeks = [];
    const currentYear = new Date().getFullYear();

    for (let week = 1; week <= 52; week++) {
      const weekStart = new Date(currentYear, 0, 1 + (week - 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      weeks.push({
        weekNumber: week,
        startDate: weekStart,
        endDate: weekEnd,
        hasActivity: activityData.some((note) => {
          const noteDate = new Date(note.date);
          // Reset time to start of day for accurate comparison
          noteDate.setHours(0, 0, 0, 0);
          const startOfWeek = new Date(weekStart);
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(weekEnd);
          endOfWeek.setHours(23, 59, 59, 999);
          return noteDate >= startOfWeek && noteDate <= endOfWeek;
        }),
      });
    }

    return weeks;
  };

  const weeks = generateWeeks();

  // Count total weeks with activity
  const activeWeeks = weeks.filter((week) => week.hasActivity).length;

  return (
    <div className="p-6 bg-surface border border-border rounded-xl w-80 md:w-96 lg:w-[28rem] mx-auto shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Weekly Activity</h3>
        <div className="text-sm text-text-light ml-4">{activeWeeks}/52</div>
      </div>

      <div className="grid grid-cols-13 gap-1 mb-2">
        {weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`
              w-3 h-3 rounded-sm transition-all duration-200 cursor-pointer
              ${
                week.hasActivity
                  ? "bg-primary hover:bg-primary-light"
                  : "bg-surface-light border border-border hover:bg-border"
              }
            `}
            title={`Week ${
              week.weekNumber
            }: ${week.startDate.toLocaleDateString()} - ${week.endDate.toLocaleDateString()}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgressBar;
