import { useSettings } from "./hooks/useSettings";

export function FormTagSection(props) {
  const { settings } = useSettings(props.dirHandle);

  return <div>{settings}</div>;
}
