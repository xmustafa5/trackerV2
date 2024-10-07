import { useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import Tooltip from "../common/Tooltip";

const sleep = async (time = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

function HeatMap({ data }) {
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

      // Maximum distance where elements are affected by the mouse
      const maxDistance = 150;

      // Move elements away if they are within maxDistance
      if (distance < maxDistance) {
        const deltaX = rectCenterX - mouseX; // Distance between mouse and rect on X-axis
        const deltaY = rectCenterY - mouseY; // Distance between mouse and rect on Y-axis
        const angle = Math.atan2(deltaY, deltaX); // Angle to move the element away from the mouse
        // Determine the amount of translation based on proximity to mouse
        const translationFactor = ((maxDistance - distance) / maxDistance) * 50; // Scale the movement
        // Apply transformation to move the rect away from the mouse
        rect.style.transform = `translate(${Math.cos(angle) * translationFactor}px, ${Math.sin(angle) * translationFactor}px)`;
        rect.style.transition = "transform 0.2s ease";
      } else {
        rect.style.transform = ""; // Reset if out of range
      }
    });
  };

  const handleMouseOut = () => {
    const rects = document.querySelectorAll("rect");

    rects.forEach((rect) => {
      rect.style.transform = ""; // Reset the rects when the mouse moves out
    });
  };
  
  useEffect(() => {
    const animateRects = async () => {
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
        
        // Initial random animation (translate and rotate)
        if (index % 2 === 0) {
          rect.style.transform = `translate(-80%,-73%) rotate(${
            Math.random() * 360
            }deg)`;
          } else {
          rect.style.transform = `translate(120%, 80%) rotate(${
            Math.random() * 360
          }deg)`;
        }
      });
      
      // Wait for all animations to complete (delay)
      
      // Reset transformations after the animation completes
      rects.forEach((rect, index) => {
        setTimeout(() => {
          rect.style.transform = ""; // Reset to normal state
        }, index * 10); // Stagger the reset for smoother effect
      });
    };
    
    // Trigger the animation
    animateRects();
  }, []);

  useEffect(() => {
    const initializeMouseHandlers = async () => {
      // Wait for 3 seconds before adding the mouse event listeners
      await sleep(3000);

      // Add event listeners
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseout", handleMouseOut);
    };

    // Call the async function to handle sleep
    initializeMouseHandlers();

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const today = new Date();

  return (
    <div style={{ height: "100vh" }}>
      <h1>react-calendar-heatmap demos</h1>
      <Tooltip id="my-tooltip" />

      <p>Random values with onClick and react-tooltip</p>
      <CalendarHeatmap
        startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
        endDate={today}
        values={data}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-${value.count}`;
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
