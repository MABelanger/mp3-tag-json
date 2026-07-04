export function getSoundName(mp3RelativePath) {
  const fileName = mp3RelativePath.split("/").pop();
  const soundName = fileName.slice(0, -4);
  return soundName;
}
