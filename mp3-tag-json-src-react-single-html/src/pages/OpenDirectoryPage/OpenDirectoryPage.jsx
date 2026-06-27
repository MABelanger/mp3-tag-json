import { useNavigate } from "react-router-dom";
import { ReadWriteDirectory } from "../../components/ReadWriteDirectory";

export function OpenDirectoryPage(props) {
  const navigate = useNavigate();
  function handleScannedFiles(scannedFiles, dirHandle) {
    navigate("/settings", {
      state: { scannedFiles, dirHandle },
    });
    // navigate("/settings");
  }

  return (
    <div>
      <ReadWriteDirectory onScannedFiles={handleScannedFiles} />;
    </div>
  );
}
