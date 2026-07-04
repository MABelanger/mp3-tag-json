const SKIP_TIME_SECONDS = 2;

export function pause(audio) {
  audio.pause();
}

export function play() {
  audio.play();
}

export function tooglePlayPause(audio) {
  if (audio.paused) {
    audio.play();
    return true;
  } else {
    audio.pause();
    return false;
  }
}

export function skipForward(audio) {
  // Check if the new time is within the audio duration
  if (audio.currentTime + SKIP_TIME_SECONDS <= audio.duration) {
    audio.currentTime += SKIP_TIME_SECONDS; // Skip forward by 10 seconds
  } else {
    // Optionally jump to the end or duration limit
    audio.currentTime = audio.duration;
  }
}

// Function to skip backward
export function skipBackward(audio) {
  // Check if the new time is non-negative
  if (audio.currentTime - SKIP_TIME_SECONDS >= 0) {
    audio.currentTime -= SKIP_TIME_SECONDS; // Skip backward by 10 seconds
  } else {
    // Optionally jump to the start
    audio.currentTime = 0;
  }
}
