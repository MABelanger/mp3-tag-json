import { useLocation } from "react-router-dom";
import { FormTagSection } from "./FormTagSection";
import { PlayerWithCoverArt } from "./PlayerWithCoverArt";

export function TaggerPlayerPage(props) {
  const location = useLocation();
  const scannedFiles = location.state?.scannedFiles;
  const dirHandle = location.state?.dirHandle;

  const mp3Tracks = scannedFiles.filter((scannedFile) => {
    return (scannedFile.fileType = "mp3");
  });
  return (
    <div>
      <PlayerWithCoverArt tracks={mp3Tracks} />
      <FormTagSection dirHandle={dirHandle} />
    </div>
  );
}
