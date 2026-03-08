import { useEffect, useState } from "react";
import { useMp3TagJson } from "./hooks/useMp3TagJson";
import { Mp3Sections } from "./Mp3Sections";
import { Header } from "./Header";
import styles from "./App.module.css";

function App() {
  const { mp3TagJson, isLoading, error } = useMp3TagJson();

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = isDark ? styles.darkTheme : styles.lightTheme;

    document.body.classList.remove(styles.darkTheme, styles.lightTheme);
    document.body.classList.add(theme);
  }, [isDark]);

  if (isLoading) {
    return <div>loading mp3-tag.json</div>;
  }

  if (error) {
    return <pre>{error}</pre>;
  }

  // div style={{ backgroundColor: "#1E1E1E", color: "#DDD" }}>
  return (
    <div>
      <Header />
      <Mp3Sections mp3TagJsons={mp3TagJson} />
    </div>
  );
}

export default App;
