export function getFilePath(relativePath) {
  if (import.meta.env.DEV) {
    console.log("Running in development mode");
    return relativePath;
  }

  const baseLocalPath = "file:///home/data/my_data/dev/dj-project/mp3-tag-json";

  return baseLocalPath + relativePath;
}

export function getMp3FilesArray(fileListObj) {
  const filesArray = Array.from(fileListObj);

  const mp3FilesArray = filesArray.filter(
    (file) =>
      file.type === "audio/mpeg" || file.name.toLowerCase().endsWith(".mp3")
  );

  return mp3FilesArray;
}
