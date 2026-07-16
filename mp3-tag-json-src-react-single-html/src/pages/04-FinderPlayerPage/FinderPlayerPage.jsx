import { useLocation } from "react-router-dom";
import { FinderPlayer } from "./FinderPlayer";

export function FinderPlayerPage(props) {
  const location = useLocation();
  const scannedFiles = location.state?.scannedFiles;
  const dirRootHandle = location.state?.dirRootHandle;

  const jsonTracks = scannedFiles.filter((scannedFile) => {
    return scannedFile.fileType == "json";
  });

  return (
    <div>
      <FinderPlayer jsonTracks={jsonTracks} dirRootHandle={dirRootHandle} />
    </div>
  );
}
