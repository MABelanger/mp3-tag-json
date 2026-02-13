import { getSoundName } from "./utils";
import { CoverArt } from "./CoverArt";
import { getAudioUrl } from "../utils";
import { Title } from "./Title";
import { Labels } from "./Labels";

export function InfoHeader(props) {
  const { mp3RelativePath } = props.mp3TagJson;
  const soundName = getSoundName(mp3RelativePath);
  const audioUrl = getAudioUrl(mp3RelativePath);

  return (
    <table>
      <tr>
        <td>
          <CoverArt audioUrl={audioUrl} />
        </td>
        <td>
          <Title soundName={soundName} />
          <Labels mp3TagJson={props.mp3TagJson} />
        </td>
      </tr>
    </table>
  );
}
