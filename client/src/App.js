import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Products from "./pages/Products/Products"


const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>
  },
  {
    path:"/products/:id",
    element:<Product/>
  },
  {
    path:"/product/:id",
    element:<Products/>
  },
])
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
