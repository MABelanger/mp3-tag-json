import { useState } from "react";
import { getFileHandleFromPath } from "./fileHandleUtils";

export function useWriteFile() {
  const [isSaving, setIsSaving] = useState(false);
  async function writeNestedFile(dirRootHandle, filePath, fileContent) {
    try {
      setIsSaving(true);

      const fileHandle = await getFileHandleFromPath(
        dirRootHandle,
        filePath,
        true
      );

      // 5. Write the content
      const writable = await fileHandle.createWritable();
      await writable.write(fileContent);
      await writable.close();

      console.log(`Successfully created: ${filePath}`);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(`Failed to write path "${filePath}":`, error);
    }
  }

  return { writeNestedFile, isSaving };
}
