import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { OpenDirectoryPage } from "./pages/OpenDirectoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaggerPlayer } from "./pages/TaggerPlayer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <OpenDirectoryPage /> },
      { path: "taggerPlayer", element: <TaggerPlayer /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
