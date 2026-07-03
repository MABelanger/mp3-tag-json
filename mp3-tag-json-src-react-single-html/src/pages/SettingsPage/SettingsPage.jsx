import { useLocation, useNavigate } from "react-router-dom";
import { useWriteFile } from "../../components/ReadWriteDirectory/hooks/useWriteFile";

/*
  "mp3RelativePath": "./mp3/new2/Half Moon Run - Crawl Back In (live from the Treehouse).mp3",
  "md5sum": "a3a531f7dc5e50ca0dd519d9217cb9d9",
  "duration": "03:26",
  "bpm": "+-83",
  "instrumentOrTypes": "guitar",
  "expention": "0",
  "festive": "3",
  "contact": "5",
  "rythmic": "3",
  "bass": "2",
  "curve": "10",
  "note": "Voix et guit cool"
*/
export function SettingsPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { writeNestedFile, isSaving } = useWriteFile();

  function handleWrite() {
    const data = JSON.stringify(
      {
        dropdownRange: {
          min: 0,
          max: 10,
        },
        dropdowns: [
          "expention",
          "festive",
          "contact",
          "rythmic",
          "bass",
          "curve",
        ],
        textInputs: ["bpm", "notes"],
        hashTags: ["instruments", "cues"],
      },
      null,
      2
    );
    writeNestedFile(location.state?.dirHandle, "settings.json", data);
  }

  function handleNext() {
    navigate("/taggerPlayer", {
      state: {
        scannedFiles: location.state?.scannedFiles,
        dirHandle: location.state?.dirHandle,
      },
    });
  }
  return (
    <div>
      <h1>Settings Page</h1>
      {
        //JSON.stringify(scannedFiles, null, 3)
      }
      dirHandle : {JSON.stringify(location.state?.dirHandle, null, 3)}
      <button onClick={handleWrite}> write </button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}
