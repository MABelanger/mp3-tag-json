export function Results(props) {
  return (
    <ul>
      {props.results.map((track) => (
        <li key={track.id}>
          BPM: {track.bpm} | Instruments:{" "}
          {Array.isArray(track.instruments)
            ? track.instruments.join(",")
            : track.instruments}
          | cues:{" "}
          {Array.isArray(track.cues) ? track.cues.join(",") : track.cues}
        </li>
      ))}
    </ul>
  );
}
