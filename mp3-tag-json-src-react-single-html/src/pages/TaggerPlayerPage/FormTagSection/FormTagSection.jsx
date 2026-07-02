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

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Dynamic Config Instance</h2>
      <DynamicForm config={configData} />
    </div>
  );
}
