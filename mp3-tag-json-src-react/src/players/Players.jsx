import { Player } from "./Player";

export function Players(props) {
  return props.mp3TagJsons.map((mp3TagJson, i) => {
    const fileName = mp3TagJson.mp3RelativePath.split("/").pop();
    return (
      <div key={i}>
        <Player mp3TagJson={mp3TagJson} />
      </div>
    );
  });
}
