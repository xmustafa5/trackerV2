import { createBrowserRouter } from "react-router-dom";
import Contributions from "../pages/Contributions";
import Sidebar from "../layout/Sidebar";
import Tracker from "../pages/Tracker";
import ImageSplit from "../pages/ImageAnimation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      // administrative
      { path: "", element: <Tracker /> },
      { path: "contributions", element: <Contributions /> },
      { path: "image-animation", element: <ImageSplit /> },

    ],
  },
]);
export default router;
