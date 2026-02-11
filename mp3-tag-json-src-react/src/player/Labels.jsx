export function Labels(props) {
  const { mp3TagJson } = props;
  return (
    <div>
      mp3RelativePath : {mp3TagJson.mp3RelativePath} <br />
      "duration": {mp3TagJson.duration} <br />
      "bpm": {mp3TagJson.bpm} <br />
      "instrumentOrTypes": {mp3TagJson.instrumentOrTypes} <br />
      "expention": {mp3TagJson.expention} <br />
      "festive": {mp3TagJson.festive} <br />
      "contact": {mp3TagJson.contact} <br />
      "rythmic": {mp3TagJson.rythmic} <br />
      "bass": {mp3TagJson.bass} <br />
      "curve": {mp3TagJson.curve} <br />
      "note": {mp3TagJson.note} <br />
    </div>
  );
}
