function getFileType(entryName) {
  const lowerName = entryName.toLowerCase();

  if (lowerName.endsWith(".mp3")) {
    return "mp3";
  }

  if (lowerName.endsWith(".json")) {
    return "json";
  }
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
