import { useLocation } from "react-router-dom";
import { useWriteFile } from "../../components/ReadWriteDirectory/hooks/useWriteFile";

export function SettingsPage(props) {
  const location = useLocation();
  const { writeNestedFile, isSaving } = useWriteFile();
  const scannedFiles = location.state?.scannedFiles;
  const dirHandle = location.state?.dirHandle;

  function handleWrite() {
    writeNestedFile(
      dirHandle,
      "mp3/new01/Norah Jones - Sunrise.mp3.txt",
      "test"
    );
  }
  return (
    <div>
      <h1>Settings Page</h1>
      {
        //JSON.stringify(scannedFiles, null, 3)
      }
      dirHandle : {JSON.stringify(dirHandle, null, 3)}
      <button onClick={handleWrite}> write </button>
    </div>
  );
}
