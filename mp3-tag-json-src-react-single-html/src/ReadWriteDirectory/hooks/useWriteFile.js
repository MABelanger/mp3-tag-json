import { useState } from "react";

export function useWriteFile() {
  const [isSaving, setIsSaving] = useState(false);
  async function writeNestedFile(rootHandle, pathString, fileContent) {
    try {
      setIsSaving(true);
      // 1. Split the path into individual pieces and clean empty segments
      const pathParts = pathString
        .split("/")
        .filter((part) => part.trim() !== "");

      // 2. Separate the file name from the folder path
      const fileName = pathParts.pop();

      // 3. Traverse and create the directory chain
      let currentDirHandle = rootHandle;
      for (const folderName of pathParts) {
        currentDirHandle = await currentDirHandle.getDirectoryHandle(
          folderName,
          { create: true }
        );
      }

      // 4. Create the file in the deepest folder
      const fileHandle = await currentDirHandle.getFileHandle(fileName, {
        create: true,
      });

      // 5. Write the content
      const writable = await fileHandle.createWritable();
      await writable.write(fileContent);
      await writable.close();

      console.log(`Successfully created: ${pathString}`);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(`Failed to write path "${pathString}":`, error);
    }
  }

  return { writeNestedFile, isSaving };
}
