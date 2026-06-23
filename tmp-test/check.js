// Test if local file access is working under file:// protocol
if (window.location.protocol === "file:") {
  fetch("./vite.svg") // Or any asset file in your dist folder
    .then((response) => {
      if (!response.ok) throw new Error("Fetch failed");
      return response.text();
    })
    .then(() => console.log("✅ Flag is ACTIVE: file:// access permitted."))
    .catch((err) =>
      console.error("❌ Flag is INACTIVE: Blocked by CORS.", err)
    );
} else {
  console.log("ℹ️ You are on localhost. This flag cannot be tested here.");
}
