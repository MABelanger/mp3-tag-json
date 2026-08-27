import { useState } from "react";
import { useSearchIndexDb } from "./hooks/useSearchIndexDb10";
import { RangeDropdown } from "./ui-form/RangeDropdown";
import { getArrayFromHashtag } from "./utils/hashTagSearchUtils3";

// Your centralized query and validation schema layout rulebook
export const SEARCH_CONFIG = [
  { key: "bpm", type: "range", variance: 5 },
  { key: "notes", type: "range", variance: 2 },
  { key: "expention", type: "range", variance: 1 },
  { key: "festive", type: "range", variance: 1 },
  { key: "contact", type: "range", variance: 1 },
  { key: "rythmic", type: "range", variance: 1 },
  { key: "bass", type: "range", variance: 1 },
  { key: "curve", type: "range", variance: 1 },
  { key: "instruments", type: "exact", multiEntry: true },
  { key: "cues", type: "exact", multiEntry: true },
];

export function FinderPlayer(props) {
  console.log("props.jsonTracks", props.jsonTracks);
  const rangeConfig = { min: 0, max: 5 };

  // 1. DYNAMIC INITIAL STATE: Extract initial states seamlessly straight from your schema settings
  const [inputFilters, setInputFilters] = useState(() => {
    const initialState = {};
    SEARCH_CONFIG.forEach((config) => {
      initialState[config.key] = "";
    });
    return initialState;
  });

  const { setPage, setFilters, filters, results, loading, error, hasMore } =
    useSearchIndexDb(20);

  console.log("results", results);

  // Reusable text cleaner to instantly intercept typing strings and force lowercase
  const handleFilterChange = (e, isMultiEntry = false) => {
    const { name, value } = e.target;

    // Instantly normalize uppercase string letters to lowercase in real time
    const lowercasedValue = value.toLowerCase();

    // Update state tracking UI layer variables instantly
    setInputFilters((prev) => ({ ...prev, [name]: lowercasedValue }));

    // Format properties heading out into the custom IndexedDB search module layers
    if (isMultiEntry) {
      setFilters((prev) => ({
        ...prev,
        [name]: getArrayFromHashtag(lowercasedValue),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: lowercasedValue }));
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h3>Track Explorer</h3>

      {/* DYNAMIC FORM ENGINE: Loops your configuration matrix mapping input elements onto your viewport canvas layout */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {SEARCH_CONFIG.map((field) => {
          // Pattern A: Multi-Entry Text Filters (Hashtags, arrays like Cues/Instruments)
          if (field.multiEntry) {
            return (
              <div
                key={field.key}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  style={{
                    fontWeight: "600",
                    textTransform: "capitalize",
                    fontSize: "0.85rem",
                  }}
                >
                  {field.key}
                </label>
                <input
                  type="text"
                  name={field.key}
                  value={inputFilters[field.key]}
                  onChange={(e) => handleFilterChange(e, true)}
                  placeholder={`${field.key} #`}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            );
          }

          // Pattern B: The specialized BPM layout item (requires number casting)
          if (field.key === "bpm") {
            return (
              <div
                key={field.key}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label
                  style={{
                    fontWeight: "600",
                    textTransform: "capitalize",
                    fontSize: "0.85rem",
                  }}
                >
                  BPM
                </label>
                <input
                  type="number"
                  name="bpm"
                  value={inputFilters.bpm}
                  onChange={(e) => handleFilterChange(e, false)}
                  placeholder="BPM"
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "100px",
                  }}
                />
              </div>
            );
          }

          // Pattern C: Standard Range Variables mapped onto your dynamic selection Dropdown UI elements
          return (
            <div
              key={field.key}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <RangeDropdown
                title={field.key}
                name={field.key}
                range={rangeConfig}
                value={filters[field.key]}
                onChange={(e) => handleFilterChange(e, false)}
              />
            </div>
          );
        })}
      </div>

      {loading && (
        <p style={{ color: "#2563eb", fontWeight: "500" }}>
          Reading from IndexedDB...
        </p>
      )}
      {error && (
        <p style={{ color: "#dc2626" }}>
          Error: {error.message || String(error)}
        </p>
      )}

      {/* Dynamic Results Grid Render Display */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {results.map((track) => (
          <li
            key={track.id}
            style={{
              padding: "0.75rem",
              borderBottom: "1px solid #eee",
              fontSize: "0.9rem",
            }}
          >
            <strong>BPM:</strong> {track.bpm} | <strong>Instruments:</strong>{" "}
            {Array.isArray(track.instruments)
              ? track.instruments.join(", ")
              : track.instruments || "None"}{" "}
            | <strong>Cues:</strong>{" "}
            {Array.isArray(track.cues)
              ? track.cues.join(", ")
              : track.cues || "None"}{" "}
            | <strong>Bass:</strong> {track.bass ?? "N/A"}
          </li>
        ))}
      </ul>

      {hasMore && !loading && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Load More Results
        </button>
      )}
    </div>
  );
}
