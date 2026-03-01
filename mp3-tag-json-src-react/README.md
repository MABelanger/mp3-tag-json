List all mp3 from the array of json.

# URL

https://github.com/umd-mith/webvtt-player

## TODO

```js
document.addEventListener("keydown", (event) => {
  const isModifierPressed = event.ctrlKey || event.metaKey;
  if (
    isModifierPressed &&
    event.shiftKey &&
    (event.key === "!" || event.key === "1")
  ) {
    event.preventDefault();
    console.log("Shortcut triggered!");
  }
});
```

## TODO

1. Stop all player when other player start (done)
2. skip faward/backward 10 seg (done)
