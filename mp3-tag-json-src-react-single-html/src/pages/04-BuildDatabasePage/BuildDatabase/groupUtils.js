function getMp3Handle(scannedFiles, mp3Path) {
  const scannedMp3 = scannedFiles.find((scannedFile) => {
    return scannedFile.path === mp3Path;
  });

  return scannedMp3 && scannedMp3.handle;
}

export function getWithMp3HandleJsonTracks(scannedFiles) {
  const jsonTracks = scannedFiles.filter((scannedFile) => {
    return scannedFile.fileType == "json";
  });

  return jsonTracks.map((jsonTrack) => {
    const { handle, ...restJsonTrack } = jsonTrack;

    const mp3Path = jsonTrack.path.replace(/\.[^/.]+$/, ""); // form file.json.mp3, remove the .json extention and keep the .mp3

    return {
      ...restJsonTrack,
      jsonHandle: handle,
      handle: handle,
      mp3Handle: getMp3Handle(scannedFiles, mp3Path),
      mp3Path,
    };
  });
}
