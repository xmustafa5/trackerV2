import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import { useEffect } from "react";

const today = new Date();

const Heatmap = ({ data }) => {
  console.log(data);
  useEffect(() => {
    const rects = document.querySelectorAll("rect"); // Corrected 'react' to 'rect'
    rects.forEach((d) => {
      d.style.width = "10px";
      d.style.height = "10px";
      d.style.border = "1px solid black";
      d.style.position = "absolute";
      d.style.top = `${Math.random() * 100}px`;
      d.style.left = `${Math.random() * 100}px`;
      d.style.zIndex = 1000;
      d.style.backgroundColor = "#6c6c6c";
      d.style.borderRadius = "10px"; // Works for HTML elements like divs
      d.style.transition = "transform 0.5s ease";
      d.style.transform = `translate(-70%, -50%) rotate(${
        Math.random() * 360
      }deg)`;

      setTimeout(() => {
        d.style.transform = "";
      }, 10);
      const tooltipContent = d.getAttribute("data-tooltip-content");
      if (tooltipContent) {
        d.setAttribute("data-tooltip-id", "heatmap-tooltip");
      }
    });
  }, []);

  return (
    <div>
      <h2>Your Contributions</h2>

      <ReactTooltip id="heatmap-tooltip" />
      <CalendarHeatmap
        startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-2`;
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return null;
          }
          return {
            "data-tooltip-content": `${value?.date} has count: ${value.count}`,
          };
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
};

export default Heatmap;
