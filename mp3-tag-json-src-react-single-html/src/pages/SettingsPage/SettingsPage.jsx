import { useLocation, useNavigate } from "react-router-dom";
import { useWriteFile } from "../../components/ReadWriteDirectory/hooks/useWriteFile";

export function SettingsPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { writeNestedFile, isSaving } = useWriteFile();
  const scannedFiles = location.state?.scannedFiles;
  const dirHandle = location.state?.dirHandle;

  function handleWrite() {
    const data = JSON.stringify(
      {
        dropdowns: ["bass", "energy"],
      },
      null,
      2
    );
    writeNestedFile(dirHandle, "setting.json", data);
  }

  function handleNext() {
    navigate("/taggerPlayer", {
      state: { scannedFiles, dirHandle },
    });
  }
  return (
    <div>
      <h1>Settings Page</h1>
      {
        //JSON.stringify(scannedFiles, null, 3)
      }
      dirHandle : {JSON.stringify(dirHandle, null, 3)}
      <button onClick={handleWrite}> write </button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
