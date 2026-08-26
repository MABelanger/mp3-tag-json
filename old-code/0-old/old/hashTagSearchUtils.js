/**
 * Converts a string of space-separated hashtags into an array of strings.
 * E.g., "#voice #guitar #drum" -> ["voice", "guitar", "drum"]
 */
export function getArrayFromHashtag(hashtagStr) {
  if (!hashtagStr || typeof hashtagStr !== "string") return [];

  return hashtagStr
    .trim()
    .split(/\s+/) // Split by any number of spaces
    .filter((tag) => tag.startsWith("#")) // Ensure it starts with #
    .map((tag) => tag.slice(1)); // Remove the leading #
}

/**
 * Converts an array of strings into a space-separated hashtag string.
 * E.g., ["voice", "guitar", "drum"] -> "#voice #guitar #drum"
 */
export function getHashtagFromArray(arr) {
  if (!Array.isArray(arr)) return "";

  return arr
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0) // Remove empty elements
    .map((item) => (item.startsWith("#") ? item : `#${item}`)) // Add # if missing
    .join(" ");
}
