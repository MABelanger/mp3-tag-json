export async function getAudioUrl(handle) {
  // 1. Get the standard File object from the handle
  const file = await handle.getFile();

  // 2. Generate a secure, local temporary URL (starts with blob:)
  const objectUrl = URL.createObjectURL(file);

  return objectUrl;
}
