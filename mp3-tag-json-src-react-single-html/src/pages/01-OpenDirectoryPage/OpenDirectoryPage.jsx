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
      make sure that your browser is started with the flag
      --allow-file-access-from-files
      <pre>./brave-browser-1.84.141/brave --allow-file-access-from-files</pre>
      <ReadWriteDirectory onScannedFiles={handleScannedFiles} />
    </div>
  );
}
