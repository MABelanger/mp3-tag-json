import { useLocation } from "react-router-dom";

export function SettingsPage(props) {
  const location = useLocation();
  const scannedFiles = location.state?.scannedFiles;

  return (
    <div>
      <h1>Settings Page</h1>
      scannedFiles, dirHandle
      <div>{props.dirHandle}</div>
      <p>Manage your account preferences here.</p>
    </div>
  );
}
