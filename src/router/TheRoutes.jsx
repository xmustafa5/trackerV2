import { createBrowserRouter } from "react-router-dom";
import Contributions from "../pages/contributions";
import Tracker from "../pages/Tracker";

const router = createBrowserRouter([{ path: "", element: <Tracker /> }]);
export default router;
