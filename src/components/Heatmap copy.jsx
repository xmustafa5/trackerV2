import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";

import "react-calendar-heatmap/dist/styles.css";

const today = new Date();

function HeatMap() {
  const randomValues = getRange(200).map((index) => {
    return {
      date: shiftDate(today, -index),
      count: getRandomInt(1, 3),
    };
  });

  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  function getRange(count) {
    return Array.from({ length: count }, (_, i) => i);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const rects = document.querySelectorAll("rect");
    rects.forEach((rect) => {
      const tooltipContent = rect.getAttribute("data-tooltip-content");
      if (tooltipContent) {
        rect.setAttribute("data-tooltip-id", "heatmap-tooltip");
      }
    });
  }, []);

  return (
    <div>
      <h1>react-calendar-heatmap demos</h1>
      <Tooltip id="heatmap-tooltip" />

      <p>Random values with onClick and react-tooltip</p>
      <CalendarHeatmap
        startDate={shiftDate(today, -150)}
        endDate={today}
        values={randomValues}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-${value.count}`;
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return null;
          }
          return {
            "data-tooltip-content": `${value.date
              .toISOString()
              .slice(0, 10)} has count: ${value.count}`,
          };
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
}

export default HeatMap;
