import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";

const today = new Date();

const Heatmap = ({ data }) => {
  console.log(data)
  return (
    <div>
      <h2>Your Contributions</h2>
      <CalendarHeatmap
        startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
        endDate={today}
        values={data} // Pass the correctly formatted data here
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-2`; // Adjust class as needed
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) {
            return { "data-tip": "No contributions" };
          }
          return {
            "data-tip": `${value.date}: ${value.count} contributions`, // Display date and count
          };
        }}
        showWeekdayLabels={true}
      />
      <ReactTooltip effect="solid" />
    </div>
  );
};


export default Heatmap;
