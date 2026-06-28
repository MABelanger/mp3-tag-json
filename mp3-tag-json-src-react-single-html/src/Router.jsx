import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { OpenDirectoryPage } from "./pages/OpenDirectoryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TaggerPlayerPage } from "./pages/TaggerPlayerPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <OpenDirectoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "taggerPlayer", element: <TaggerPlayerPage /> },
    ],
  },
]);
