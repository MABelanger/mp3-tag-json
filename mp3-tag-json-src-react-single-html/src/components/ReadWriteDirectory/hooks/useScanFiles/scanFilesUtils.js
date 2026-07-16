function getFileType(entryName) {
  const lowerName = entryName.toLowerCase();
  const dotIndex = lowerName.lastIndexOf(".");

  // If no dot exists or it is the very first character (hidden file), return an empty string
  if (dotIndex <= 0) {
    return "";
  }

  const fileType = lowerName.slice(dotIndex).slice(1); // Exclude the dot (e.g., ".json" => json)
  return fileType;
}

function getRelativePath(entryName, currentDirectory) {
  if (currentDirectory) {
    return `${currentDirectory}/${entryName}`;
  }

  return entryName;
}

export const recursiveScanFolder = async (
  directoryHandle,
  currentDirectory = ""
) => {
  let scannedFiles = [];

  for await (const entry of directoryHandle.values()) {
    const relativePath = getRelativePath(entry.name, currentDirectory);
    const fileType = getFileType(entry.name);

    if (entry.kind === "file" && (fileType == "mp3" || fileType == "json")) {
      console.log("scanned type", fileType);
      scannedFiles.push({
        fileType,
        name: entry.name,
        path: relativePath,
        handle: entry, // Keep the raw handle reference to pull file bytes lazily later
      });
    } else if (entry.kind === "directory") {
      console.error(entry.kind);
      const deepFiles = await recursiveScanFolder(entry, relativePath);
      console.log("deepFiles", deepFiles);
      scannedFiles = scannedFiles.concat(deepFiles);
    }
  }
  return scannedFiles;
};
