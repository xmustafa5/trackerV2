import { RouterProvider } from "react-router-dom";
import router from "./router/TheRoutes.jsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
