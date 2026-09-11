// A persistent cache stored in memory outside of the React lifecycle
const audioBlobCache = new Map();

export async function getAudioUrl(handle, mp3Path) {
  // 1. If we already generated a blob for this specific file path, return it instantly
  if (audioBlobCache.has(mp3Path)) {
    console.log("has a cache");
    return audioBlobCache.get(mp3Path);
  }

  console.log("NO CACHE");

  // 2. Otherwise, perform the heavy file extraction (only runs ONCE per file)
  // 1. Get the standard File object from the handle
  const file = await handle.getFile();

  // 2. Generate a secure, local temporary URL (starts with blob:)
  const objectUrl = URL.createObjectURL(file);

  // 3. Save it to the cache map using the stable path string as the key
  audioBlobCache.set(mp3Path, objectUrl);

  return objectUrl;
}
