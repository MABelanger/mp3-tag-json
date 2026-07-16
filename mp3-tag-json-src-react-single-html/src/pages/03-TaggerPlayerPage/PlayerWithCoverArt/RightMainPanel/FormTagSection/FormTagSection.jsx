import { useWriteFile } from "../../../../../components/ReadWriteDirectory/hooks/useWriteFile";
import { useReadFile } from "../../../../../components/ReadWriteDirectory/hooks/useReadFile";
import { DynamicForm } from "./DynamicForm";

export function FormTagSection(props) {
  const { writeNestedFile, isSaving } = useWriteFile();
  const { fileData: settings } = useReadFile(
    props.dirRootHandle,
    "settings.json"
  );

  const { fileData: initFormData } = useReadFile(
    props.dirRootHandle,
    props.jsonFilePath
  );

  // const configData = {
  //   dropdownRange: { min: 0, max: 10 },
  //   dropdowns: ["expention", "festive", "contact", "rythmic", "bass", "curve"],
  //   textInputs: ["bpm", "notes"],
  //   hashTags: ["instruments", "cues"],
  // };

  // const initFormData = {
  //   expention: 3,
  //   festive: 2,
  //   contact: 2,
  //   rythmic: 2,
  //   bass: 2,
  //   curve: 2,
  //   bpm: 2,
  //   notes: "2",
  //   instruments: "voix,citare,darbouka",
  //   cues: "tropical",
  // };

  function handleSave(data) {
    const jsonData = JSON.stringify(data, null, 2);
    const jsonFilePath = props.jsonFilePath;
    writeNestedFile(props.dirRootHandle, jsonFilePath, jsonData);
  }

  return (
    <div>
      <DynamicForm
        initFormData={initFormData}
        settings={settings}
        onSave={handleSave}
      />
    </div>
  );
}
