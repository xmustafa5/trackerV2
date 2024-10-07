import  { useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import Tooltip from "../common/Tooltip";

const today = new Date();

function HeatMap({ data }) {
  useEffect(() => {
    const rects = document.querySelectorAll("rect");
    rects.forEach((rect, index) => {
      rect.style.width = "10px";
      rect.style.height = "10px";
      rect.style.border = "1px solid black";
      rect.style.position = "absolute";
      rect.style.top = `${Math.random() * 100}px`;
      rect.style.left = `${Math.random() * 100}px`;
      rect.style.zIndex = 1000;
      rect.style.backgroundColor = "#6c6c6c";
      rect.style.borderRadius = "10px"; // Works for HTML elements like divs
      rect.style.transition = "transform 0.5s ease";
      if (index % 2 === 0) {
        rect.style.transform = `translate(-80%,-73%) rotate(${
          Math.random() * 360
        }deg)`;
      } else {
        rect.style.transform = `translate(120%, 80%) rotate(${
          Math.random() * 360
        }deg)`;
      }

      //  setTimeout(() => {
      //    if (index % 2 === 0) {
      //      rect.style.transform = `translate(-60%,60%) rotate(${
      //        Math.random() * 60
      //      }deg)`;
      //    } else {
      //      rect.style.transform = `translate(60%, 60%) rotate(${
      //        Math.random() * 60
      //      }deg)`;
      //    }
      //  }, 180);
      // setTimeout(() => {
      //   if (index % 2 === 0) {
      //     rect.style.transform = `translate(-50%,50%) rotate(${
      //       Math.random() * 60
      //     }deg)`;
      //   } else {
      //     rect.style.transform = `translate(50%, 50%) rotate(${
      //       Math.random() * 60
      //     }deg)`;
      //   }
      // }, 200);

      // setTimeout(() => {
      //   if (index % 2 === 0) {
      //     rect.style.transform = `translate(-20%,20%) rotate(${
      //       Math.random() * 60
      //     }deg)`;
      //   } else {
      //     rect.style.transform = `translate(20%, 20%) rotate(${
      //       Math.random() * 60
      //     }deg)`;
      //   }
      // }, 240);
          setTimeout(() => {
            rect.style.transform = "";
          }, index * 10);


      const tooltipContent = rect.getAttribute("data-tooltip-content");
      if (tooltipContent) {
        rect.setAttribute("data-tooltip-id", "heatmap-tooltip");
      }
    });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <h1>react-calendar-heatmap demos</h1>
      <Tooltip id="heatmap-tooltip" />

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
