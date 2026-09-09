function getMp3Handle(scannedFiles, mp3Path) {
  console.log("scannedFiles", scannedFiles);
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

    console.log("mp3Path2", mp3Path);

    return {
      ...restJsonTrack,
      jsonHandle: handle,
      handle: handle,
      mp3Handle: getMp3Handle(scannedFiles, mp3Path),
    };
  });
}
