import { getDatabase } from "../../../../db/db";
import { SEARCH_CONFIG } from "../../../../db/config";
import { executeNativeDynamicSearch } from "./nativeDynamicSearch4";

let selectedIndex = 0;
let playingIndex = 0;
let accumulatedResults = [];
let page = 1;
let filters = {};
let loading = false;
let error = null;
let hasMore = false;

const listeners = new Set();
function emitChange() {
  listeners.forEach((listener) => listener());
}

export const finderStore = {
  // --- Basic Getters ---
  getSelectedIndex() {
    return selectedIndex;
  },
  getPlayingIndex() {
    return playingIndex;
  },
  getAccumulatedResults() {
    return accumulatedResults;
  },
  getLoading() {
    return loading;
  },
  getError() {
    return error;
  },
  getHasMore() {
    return hasMore;
  },

  // --- Selection Setters ---
  setSelectedIndex(index) {
    if (selectedIndex === index) return;
    selectedIndex = index;
    emitChange();
  },
  setPlayingIndex(index) {
    if (playingIndex === index) return;
    playingIndex = index;
    emitChange();
  },

  // --- Core Database Engine ---
  async applyFilters(newFilters) {
    filters = newFilters;
    page = 1;
    accumulatedResults = [];
    hasMore = false;
    error = null;
    loading = false;
    emitChange();

    // Kick off the initial query pass
    await this.fetchNextPage();
  },

  async fetchNextPage(pageSize = 20) {
    // Stop redundant fetches
    if (loading || (page > 1 && !hasMore)) return;

    loading = true;
    error = null;
    emitChange();

    try {
      const rawDb = await getDatabase();
      const customFilters = [];

      // Parse current filters against database configurations
      SEARCH_CONFIG.forEach((config) => {
        const userValue = filters[config.key];

        if (
          userValue === "" ||
          userValue === null ||
          userValue === undefined ||
          userValue === 0 ||
          Number.isNaN(userValue)
        )
          return;

        if (Array.isArray(userValue)) {
          console.log(
            "userValue is array!! Marking items as OR filters:",
            userValue
          );
          userValue.forEach((val) => {
            if (val) {
              customFilters.push({
                key: config.key,
                type: config.type,
                partialSearch: config.partialSearch,
                value: val,
                isOrFilter: true, // 👈 Flag added here to cleanly pipe into fetchParallelIdIntersection OR logic
              });
            }
          });
        } else {
          customFilters.push({
            key: config.key,
            type: config.type,
            value: userValue,
            variance: config.variance || 0,
            isOrFilter: false, // 👈 Normal fields stay evaluated as strict AND logic
          });
        }
      });

      const output = await executeNativeDynamicSearch({
        rawDb,
        customFilters,
        page,
        pageSize,
      });

      console.log("output", output);

      // Filter out duplicate IDs from old pages safely
      const existingIds = new Set(accumulatedResults.map((item) => item.id));
      const uniqueNewResults = output.matchedItems.filter(
        (item) => !existingIds.has(item.id)
      );

      accumulatedResults = [...accumulatedResults, ...uniqueNewResults];
      hasMore = output.hasMore;
      page += 1;
    } catch (err) {
      console.error("IndexedDB store query error:", err);
      error = err;
    } finally {
      loading = false;
      emitChange();
    }
  },

  // --- Subscription Bridge Channel ---
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
