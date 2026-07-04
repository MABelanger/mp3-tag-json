import { createHashRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { OpenDirectoryPage } from "./pages/OpenDirectoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaggerPlayerPage } from "./pages/TaggerPlayerPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div className="widget-error">Widget failed to load.</div>,
    children: [
      { index: true, element: <OpenDirectoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "taggerPlayer", element: <TaggerPlayerPage /> },
    ],
  },
]);
