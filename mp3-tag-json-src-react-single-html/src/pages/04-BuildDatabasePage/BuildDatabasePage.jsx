import { useLocation, useNavigate } from "react-router-dom";
import { BuildDatabase } from "./BuildDatabase";

export function BuildDatabasePage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const scannedFiles = location.state?.scannedFiles;
  const dirRootHandle = location.state?.dirRootHandle;

  function handleNext() {
    navigate("/FinderPlayer", {
      state: {
        scannedFiles: location.state?.scannedFiles,
        dirRootHandle: location.state?.dirRootHandle,
      },
    });
  }

  const jsonTracks = scannedFiles.filter((scannedFile) => {
    return scannedFile.fileType == "json";
  });

  return (
    <div>
      <BuildDatabase
        jsonTracks={jsonTracks}
        dirRootHandle={dirRootHandle}
        onNext={handleNext}
      />
    </div>
  );
}
