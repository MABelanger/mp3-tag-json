import { Player } from "./Player";

export function Players(props) {
  return props.mp3TagJsons.map((mp3TagJson) => {
    return (
      <div>
        <Player mp3TagJson={mp3TagJson} />
      </div>
    );
  });
}
