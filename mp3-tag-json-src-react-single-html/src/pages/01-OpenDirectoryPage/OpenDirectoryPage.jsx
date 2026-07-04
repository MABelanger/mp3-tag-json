import { useNavigate } from "react-router-dom";
import { ReadWriteDirectory } from "../../components/ReadWriteDirectory";

export function OpenDirectoryPage(props) {
  const navigate = useNavigate();
  function handleScannedFiles(scannedFiles, dirRootHandle) {
    navigate("/settings", {
      state: { scannedFiles, dirRootHandle },
    });
    // navigate("/settings");
  }

  return (
    <div>
      <ReadWriteDirectory onScannedFiles={handleScannedFiles} />;
    </div>
  );
}
