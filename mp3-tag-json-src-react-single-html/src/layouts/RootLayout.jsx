import { Outlet, Link, useNavigate } from "react-router-dom";

export function RootLayout(props) {
  return (
    <div>
      layouts
      <Outlet />
    </div>
  );
}
