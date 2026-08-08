/**
 * Converts a hashtag search string into a clean array of instrument tokens.
 * Gracefully ignores trailing hanging '#' symbols while typing.
 */
export function getArrayFromHashtag(hashtagStr) {
  if (!hashtagStr || typeof hashtagStr !== "string") return [];

  return (
    hashtagStr
      .toLowerCase()
      .split(/\s+/)
      .map((tag) => tag.trim())
      // Keep it if it starts with # and contains letters after the #
      .filter((tag) => tag.startsWith("#") && tag.length > 1)
      .map((tag) => tag.slice(1))
  );
}

/**
 * Converts the state array back into a space-separated hashtag string for the UI text input.
 * Ensures typing continuity by allowing hanging tags or spaces.
 */
export function getHashtagFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";

  return arr
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)
    .map((item) =>
      item.startsWith("#") ? item.toLowerCase() : `#${item.toLowerCase()}`
    )
    .join(" ");
}
