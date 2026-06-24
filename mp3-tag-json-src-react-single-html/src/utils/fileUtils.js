export function getFilePath(relativePath) {
  if (import.meta.env.DEV) {
    console.log("Running in development mode");
    return relativePath;
  }

  const baseLocalPath = "file:///home/data/my_data/dev/dj-project/mp3-tag-json";

  return "file:///home/data/my_data/dev/dj-project/mp3-tag-json/data/mp3/new01/Norah%20Jones%20-%20Don't%20Know%20Why.mp3";
  // return baseLocalPath + relativePath;
}
