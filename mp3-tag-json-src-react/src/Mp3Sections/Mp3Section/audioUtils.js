export function tooglePlayPause(audio) {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

export function skipForward(audio) {
  // Check if the new time is within the audio duration
  if (audio.currentTime + 10 <= audio.duration) {
    audio.currentTime += 10; // Skip forward by 10 seconds
  } else {
    // Optionally jump to the end or duration limit
    audio.currentTime = audio.duration;
  }
}

// Function to skip backward
export function skipBackward(audio) {
  // Check if the new time is non-negative
  if (audio.currentTime - 10 >= 0) {
    audio.currentTime -= 10; // Skip backward by 10 seconds
  } else {
    // Optionally jump to the start
    audio.currentTime = 0;
  }
}
