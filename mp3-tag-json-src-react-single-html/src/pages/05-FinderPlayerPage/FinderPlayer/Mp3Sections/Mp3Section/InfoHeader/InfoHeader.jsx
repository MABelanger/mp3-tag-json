import { getSoundName } from "./utils";
import { CoverArt } from "./CoverArt";
import { getAudioUrl } from "../utils";
import { Title } from "./Title";
import { TableData } from "./TableData";

export function InfoHeader(props) {
  console.log("props.audioUrl", props.audioUrl);
  const { mp3Path } = props.result;
  const soundName = getSoundName(mp3Path);

  return (
    <table style={{ width: "900px" }}>
      <tr>
        <td style={{ width: "125px" }}>
          <CoverArt audioUrl={props.audioUrl} />
        </td>
        <td>
          <Title soundName={soundName} />
          <TableData result={props.result} />
        </td>
      </tr>
    </table>
  );
}
