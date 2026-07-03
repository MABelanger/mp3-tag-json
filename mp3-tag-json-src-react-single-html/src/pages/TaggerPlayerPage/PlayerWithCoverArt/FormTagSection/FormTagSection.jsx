import { DynamicForm } from "./DynamicForm";
import { useSettings } from "./hooks/useSettings";

export function FormTagSection(props) {
  const { settings } = useSettings(props.dirHandle);

  const configData = {
    dropdownRange: { min: 0, max: 10 },
    dropdowns: ["expention", "festive", "contact", "rythmic", "bass", "curve"],
    textInputs: ["bpm", "notes"],
    hashTags: ["instruments", "cues"],
  };

  function handleSave(data) {
    console.log("data", data);
  }
  return (
    <div>
      <DynamicForm config={configData} onSave={handleSave} />
    </div>
  );
}
