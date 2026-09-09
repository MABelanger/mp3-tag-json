import { getSoundName } from "./utils";
import { CoverArt } from "./CoverArt";
import { getAudioUrl } from "../utils";
import { Title } from "./Title";
import { Labels } from "./Labels";

export function InfoHeader(props) {
  console.log("props.audioUrl", props.audioUrl);
  const soundName = getSoundName(props.path);

  return (
    <table>
      <tr>
        <td>
          <CoverArt audioUrl={props.audioUrl} />
        </td>
        <td>
          <Title soundName={soundName} />
          {/* <Labels mp3TagJson={props.mp3TagJson} /> */}
        </td>
      </tr>
    </table>
  );
}
