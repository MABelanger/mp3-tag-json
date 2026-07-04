import { useLocation, useNavigate } from "react-router-dom";
import { PlayerWithCoverArt } from "./PlayerWithCoverArt";

export function TaggerPlayerPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const scannedFiles = location.state?.scannedFiles;
  const dirRootHandle = location.state?.dirRootHandle;

  const mp3Tracks = scannedFiles.filter((scannedFile) => {
    return (scannedFile.fileType = "mp3");
  });

  function handleNext() {
    navigate("/finderPlayer", {
      state: {
        scannedFiles,
        dirRootHandle,
      },
    });
  }

  return (
    <div>
      <button onClick={handleNext}>next finderPlayer</button>
      <PlayerWithCoverArt tracks={mp3Tracks} dirRootHandle={dirRootHandle} />
    </div>
  );
}
