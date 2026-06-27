import { PlayerWithCoverArt } from "./PlayerWithCoverArt";

export function TaggerPlayer(props) {
  return (
    <div>
      <PlayerWithCoverArt tracks={mp3Tracks} />
    </div>
  );
}
