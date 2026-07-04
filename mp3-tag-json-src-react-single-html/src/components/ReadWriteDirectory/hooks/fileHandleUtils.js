export async function getFileHandleFromPath(dirRootHandle, filePath, isCreate) {
  // 1. Split the path into individual pieces and clean empty segments
  const pathParts = filePath.split("/").filter((part) => part.trim() !== "");

  // 2. Separate the file name from the folder path
  const fileName = pathParts.pop();

  // 3. Traverse and create the directory chain
  let currentDirHandle = dirRootHandle;

  for (const folderName of pathParts) {
    currentDirHandle = await currentDirHandle.getDirectoryHandle(folderName, {
      create: isCreate,
    });
  }

  // 4. Create the file in the deepest folder
  const fileHandle = await currentDirHandle.getFileHandle(fileName, {
    create: isCreate,
  });

  return fileHandle;
}

async function getFileHandleFromPathNew(
  dirRootHandle,
  filePath,
  options = { create: true }
) {
  // 1. Clean the path and split it into segments
  const segments = filePath
    .split(/[\\/]/)
    .filter((segment) => segment.length > 0);

  // 2. Separate the filename from the folder names
  const fileName = segments.pop();
  let currentDirHandle = dirRootHandle;

  // 3. Recursively (iteratively) drill down or create each directory
  for (const folderName of segments) {
    // Replicates Step 1 dynamically for each subfolder
    currentDirHandle = await currentDirHandle.getDirectoryHandle(
      folderName,
      options
    );
  }

  // 4. Replicates Step 2 to get/create the final file handle
  const fileHandle = await currentDirHandle.getFileHandle(fileName, options);

  return fileHandle;
}
