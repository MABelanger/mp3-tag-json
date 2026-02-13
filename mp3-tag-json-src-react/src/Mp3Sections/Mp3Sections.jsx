import { Mp3Section } from "./Mp3Section";

export function Mp3Sections(props) {
  return props.mp3TagJsons.map((mp3TagJson, i) => {
    return (
      <div key={i}>
        <Mp3Section mp3TagJson={mp3TagJson} />
      </div>
    );
  });
}
