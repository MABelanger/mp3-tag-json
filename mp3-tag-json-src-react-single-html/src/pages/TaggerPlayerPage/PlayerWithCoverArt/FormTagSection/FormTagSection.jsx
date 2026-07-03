import { useWriteFile } from "../../../../components/ReadWriteDirectory/hooks/useWriteFile";
import { DynamicForm } from "./DynamicForm";
import { useSettings } from "./hooks/useSettings";

export function FormTagSection(props) {
  const { writeNestedFile, isSaving } = useWriteFile();
  const { settings } = useSettings(props.dirHandle);

  // const configData = {
  //   dropdownRange: { min: 0, max: 10 },
  //   dropdowns: ["expention", "festive", "contact", "rythmic", "bass", "curve"],
  //   textInputs: ["bpm", "notes"],
  //   hashTags: ["instruments", "cues"],
  // };

  function handleSave(data) {
    const jsonData = JSON.stringify(data, null, 2);
    const jsonFilePath = props.filePath + ".json";
    writeNestedFile(props.dirHandle, jsonFilePath, jsonData);
  }

  return (
    <div>
      <DynamicForm config={settings} onSave={handleSave} />
    </div>
  );
}
