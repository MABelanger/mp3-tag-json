import { useSyncExternalStore } from "react";

// 1. External store values stay outside the React lifecycle loop
let selectedIndex = 0;
let playingIndex = 0;
let accumulatedResults = [];
let page = 1;
let loading = false;
let hasMore = true;
let currentFilters = {};

const listeners = new Set();
function emitChange() {
  listeners.forEach((l) => l());
}

const store = {
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
  getHasMore() {
    return hasMore;
  },

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

  async applyFilters(newFilters) {
    currentFilters = newFilters;
    page = 1;
    accumulatedResults = [];
    hasMore = true;
    loading = false;
    emitChange();
    await this.fetchNextPage();
  },

  async fetchNextPage() {
    if (loading || !hasMore) return;
    loading = true;
    emitChange();

    try {
      // --- Put your original IndexedDB query logic here ---
      const pageSize = 20;
      const rawResults = []; // Replace with: await queryIndexedDb(currentFilters, page, pageSize)

      if (rawResults.length < pageSize) {
        hasMore = false;
      }

      const existingIds = new Set(accumulatedResults.map((item) => item.id));
      const uniqueNewResults = rawResults.filter(
        (item) => !existingIds.has(item.id)
      );

      accumulatedResults = [...accumulatedResults, ...uniqueNewResults];
      page += 1;
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      loading = false;
      emitChange();
    }
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// 2. THE CUSTOM HOOK EXPORT:
// Takes a selector function so components can pull ONLY what they care about.
export function useFinderStore(selector) {
  return useSyncExternalStore(store.subscribe, () => selector(store));
}

// 3. EXPOSE ACTIONS:
// Export structural controller triggers directly so components can fire operations
export const finderActions = {
  setSelectedIndex: (idx) => store.setSelectedIndex(idx),
  setPlayingIndex: (idx) => store.setPlayingIndex(idx),
  applyFilters: (filters) => store.applyFilters(filters),
  fetchNextPage: () => store.fetchNextPage(),
};
