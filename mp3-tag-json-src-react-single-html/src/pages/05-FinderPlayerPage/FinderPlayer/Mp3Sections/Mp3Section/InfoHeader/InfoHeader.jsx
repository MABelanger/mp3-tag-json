import { getSoundName } from "./utils";
import { CoverArt } from "./CoverArt";
import { getAudioUrl } from "../utils";
import { Title } from "./Title";
import { Labels } from "./Labels";

export function InfoHeader(props) {
  console.log("props.audioUrl", props.audioUrl);
  const { mp3Path } = props.result;
  const soundName = getSoundName(mp3Path);

  return (
    <table>
      <tr>
        <td>
          <CoverArt audioUrl={props.audioUrl} />
        </td>
        <td>
          <Title soundName={soundName} />
          <Labels result={props.result} />
        </td>
      </tr>
    </table>
  );
}
