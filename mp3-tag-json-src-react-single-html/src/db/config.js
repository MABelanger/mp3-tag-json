// // 1. Centralized dynamic configuration file matching your TODO blueprint
// export const SEARCH_CONFIG = [
//   { key: "bpm", type: "range", variance: 5 },
//   { key: "bass", type: "range", variance: 1 },
//   { key: "instruments", type: "exact" }, // maps 'hashtag' matching style to engine
//   { key: "cues", type: "exact" },
// ];

// 1. Your dynamic configuration file
// export const SEARCH_CONFIG = [
//   { key: "bpm", type: "range", variance: 5 },
//   { key: "bass", type: "range", variance: 1 },
//   { key: "instruments", type: "exact", multiEntry: true }, // Added flag for array fields
//   { key: "cues", type: "exact", multiEntry: true }, // Added flag for array fields
// ];

export const SEARCH_CONFIG = [
  { key: "bpm", type: "range", variance: 5 },
  { key: "notes", type: "exact", multiEntry: false },
  { key: "expention", type: "range", variance: 1 },
  { key: "festive", type: "range", variance: 1 },
  { key: "contact", type: "range", variance: 1 },
  { key: "rythmic", type: "range", variance: 1 },
  { key: "bass", type: "range", variance: 1 },
  { key: "curve", type: "range", variance: 1 },
  { key: "instruments", type: "exact", multiEntry: true },
  { key: "cues", type: "exact", multiEntry: true },
];
