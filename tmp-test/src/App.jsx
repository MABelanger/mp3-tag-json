function App() {
  fetch("test.txt")
    .then((response) => response.text())
    .then((data) => console.log("Success! Flag is ACTIVE:", data))
    .catch((err) => console.error("Failed! Flag is INACTIVE:", err));

  async function listFolderContents() {
    try {
      // 1. Prompt user to select a folder on their computer
      const directoryHandle = await window.showDirectoryPicker();

      console.log(`Listing files for directory: ${directoryHandle.name}`);

      // 2. Iterate through all files inside the directory
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file") {
          console.log(`📄 File: ${entry.name}`);
        } else if (entry.kind === "directory") {
          console.log(`📁 Subfolder: ${entry.name}`);
        }
      }
    } catch (err) {
      console.error("User denied permission or folder reading failed:", err);
    }
  }

  const folderBtn = document.getElementById("folderBtn");
  const output = document.getElementById("output");

  if (folderBtn) {
    folderBtn.addEventListener("click", async () => {
      // Double-check if the browser supports the API in this context
      if (!("showDirectoryPicker" in window)) {
        output.textContent =
          "❌ Error: showDirectoryPicker is missing. Ensure you are on http://localhost or https://";
        return;
      }

      try {
        // 1. Open the native folder picker window
        const directoryHandle = await window.showDirectoryPicker();
        let fileListText = `📁 Folder: ${directoryHandle.name}\n\n`;

        // 2. Loop through the directory contents
        for await (const entry of directoryHandle.values()) {
          if (entry.kind === "file") {
            fileListText += `📄 File: ${entry.name}\n`;
          } else if (entry.kind === "directory") {
            fileListText += `📁 Subfolder: ${entry.name}/\n`;
          }
        }

        // 3. Print the result out to the screen
        output.textContent = fileListText;
      } catch (err) {
        output.textContent = `❌ Error or user cancelled: ${err.message}`;
        console.error(err);
      }
    });
  }

  return (
    <div>
      <button id="folderBtn">Select and List Folder Files</button>
      <pre id="output"></pre>
    </div>
  );
}

export default App;
