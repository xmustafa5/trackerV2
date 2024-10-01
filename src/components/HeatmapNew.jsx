import HeatMap from "@uiw/react-heat-map";
import { Tooltip } from "react-tooltip";


const Heatmap = ({ data }) => {
  const value = [
    { date: '2016/01/11', count:2 },
    { date: '2016/04/12', count:2 },
    { date: '2016/05/01', count:5 },
    { date: '2016/05/02', count:5 },
    { date: '2016/05/03', count:1 },
    { date: '2016/05/04', count:11 },
    { date: '2016/05/08', count:32 },
  ];
  const today = new Date();
  const tt = new Date(today.getFullYear(), today.getMonth() - 11, 1)
  return (
    <div>
        <HeatMap
      value={value}
      width={600}
      startDate={new Date(today.getFullYear(), today.getMonth() - 11, 1)}
      endDate={today}
      rectRender={(props, data) => {
         if (!data.count) return <rect {...props} />;
        return (
          <Tooltip placement="top" content={`count: ${data.count || 0}`}>
            <rect {...props} />
          </Tooltip>
        );
      }}
    />
    </div>
  );
};

export default Heatmap;
