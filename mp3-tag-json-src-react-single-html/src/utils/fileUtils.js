export function getFilePath(relativePath) {
  if (import.meta.env.DEV) {
    console.log("Running in development mode");
    return relativePath;
  }

  const baseLocalPath = "file:///home/data/my_data/dev/dj-project/mp3-tag-json";

  return baseLocalPath + relativePath;
}
