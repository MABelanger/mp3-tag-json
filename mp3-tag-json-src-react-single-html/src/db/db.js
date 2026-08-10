import Dexie from "dexie";

export const db = new Dexie("TracksSearchDB");

// Declare tables and indexes
db.version(1).stores({
  tracks: "++id, bpm, bass, *instruments, *cues",
  // The '*' allows Dexie to query individual array items natively
});
