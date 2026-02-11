import { Labels } from "./Labels";

export function Player(props) {
  const { mp3RelativePath } = props.mp3TagJson;
  return (
    <div style={{ paddingBottom: "40px" }}>
      <audio controls>
        <source src={"/api/" + mp3RelativePath} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <Labels mp3TagJson={props.mp3TagJson} />
    </div>
  );
}
