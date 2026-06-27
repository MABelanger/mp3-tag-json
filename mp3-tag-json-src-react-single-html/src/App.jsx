import { RouterProvider } from "react-router-dom";

import { router } from "./Router";

export function App(props) {
  return <RouterProvider router={router} />;
}
