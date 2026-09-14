import { useWriteFile } from "../../../../../components/ReadWriteDirectory/hooks/useWriteFile";
import { useReadFile } from "../../../../../components/ReadWriteDirectory/hooks/useReadFile";
import { DynamicForm } from "../../../../../components/ui/DynamicForm";

export function FormTagSection(props) {
  console.log("hello");
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

  /*
    function getDataWithFileName(data, mp3FilePath) {
    console.log("data, mp3FilePath", data, mp3FilePath);
    // TODO : work only in mac/linux
    const fileNameCamelCase = mp3FilePath && mp3FilePath.split("/").pop();
    const fileNameLower = fileNameCamelCase && fileNameCamelCase.toLowerCase();
    return {
      ...data,
      fileName: fileNameLower,
    };
  }
  */
  function getDataWithFileName(data, mp3FilePath) {
    console.log("data, mp3FilePath", data, mp3FilePath);
    // TODO : work only in mac/linux
    const fileName = mp3FilePath && mp3FilePath.split("/").pop();

    return {
      ...data,
      fileName,
    };
  }

  function handleSave(data) {
    const dataWithMp3FileName = getDataWithFileName(data, props.mp3FilePath);
    const jsonData = JSON.stringify(dataWithMp3FileName, null, 2);

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
