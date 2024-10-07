import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import Tooltip from "../common/Tooltip";

function HeatMap({ data }) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const today = new Date();

  // Helper function to calculate the distance between two points
  const calculateDistance = (x1, y1, x2, y2) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseMove = (e) => {
    const rects = document.querySelectorAll("rect");
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    rects.forEach((rect) => {
      const rectBounds = rect.getBoundingClientRect();
      const rectCenterX = rectBounds.left + rectBounds.width / 2;
      const rectCenterY = rectBounds.top + rectBounds.height / 2;
      const distance = calculateDistance(mouseX, mouseY, rectCenterX, rectCenterY);
      // Apply transformation based on distance
      const maxDistance = 150; // Maximum distance for the effect
      const scaleFactor = Math.max(0, 1 - distance / maxDistance); // Scale based on distance

      if (distance < maxDistance) {
        rect.style.transform = `scale(${1 + scaleFactor * 0.1}) translate(${scaleFactor }px, ${scaleFactor }px)`;
        rect.style.transition = "transform 0.2s ease";
      } else {
        rect.style.transform = "";
      }
    });
  };
  const handleMouseOut = () => {
    const rects = document.querySelectorAll("rect");
    rects.forEach((rect) => {
      // Reset the rects when the mouse moves out
      rect.style.transform = "";
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    const rects = document.querySelectorAll("rect");
    rects.forEach((rect) => {
      rect.setAttribute("data-tooltip-id", "heatmap");
    });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <h1>react-calendar-heatmap demos</h1>
      <Tooltip id="my-tooltip" content={tooltipContent} position={position} visible={tooltipVisible} />
      <p>Random values with onClick and react-tooltip</p>
      <CalendarHeatmap
        startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return ` color-github-${value.count}`;
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return {
              "data-tooltip-content": `${value.date} has `,
            };
          }
          return {
            "data-tooltip-content": `${value.date} has count: ${value.count}`,
          };
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
}

export default HeatMap;
