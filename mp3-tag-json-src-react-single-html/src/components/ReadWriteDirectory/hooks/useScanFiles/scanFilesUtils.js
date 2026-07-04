function getFileType(entryName) {
  const lowerName = entryName.toLowerCase();
  console.log("lowerName", lowerName);

  const dotIndex = lowerName.lastIndexOf(".");

  console.log("dotIndex", dotIndex);

  // If no dot exists or it is the very first character (hidden file), return an empty string
  if (dotIndex <= 0) {
    return "";
  }

  const fileType = lowerName.slice(dotIndex).slice(1); // Exclude the dot (e.g., ".json" => json)
  console.log("fileType", fileType);
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
      scannedFiles.push({
        fileType: fileType,
        name: entry.name,
        path: relativePath,
        handle: entry, // Keep the raw handle reference to pull file bytes lazily later
      });
    } else if (entry.kind === "directory") {
      const deepFiles = await recursiveScanFolder(entry, relativePath);
      scannedFiles = scannedFiles.concat(deepFiles);
    }
  }
  return scannedFiles;
};
