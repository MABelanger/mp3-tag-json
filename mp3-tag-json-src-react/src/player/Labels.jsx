export function Labels(props) {
  const { mp3RelativePath, expention } = props.mp3TagJson;
  return (
    <div>
      mp3RelativePath : {mp3RelativePath} <br />
      expention : {expention}
    </div>
  );
}
