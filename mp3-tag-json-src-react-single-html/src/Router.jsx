import { createHashRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { OpenDirectoryPage } from "./pages/01-OpenDirectoryPage";
import { SettingsPage } from "./pages/02-SettingsPage";
import { TaggerPlayerPage } from "./pages/03-TaggerPlayerPage";
import { FinderPlayerPage } from "./pages/04-FinderPlayerPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div className="widget-error">Widget failed to load.</div>,
    children: [
      { index: true, element: <OpenDirectoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "taggerPlayer", element: <TaggerPlayerPage /> },
      { path: "finderPlayer", element: <FinderPlayerPage /> },
    ],
  },
]);
