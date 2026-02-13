import { useCoverArt } from "./useCoverArt";
import { useFetchMp3ArrayBuffer } from "./useFetchMp3ArrayBuffer";
import { useMetadata } from "./useMetadata";

export function useAudioMetadataReader(audioUrl) {
  const { arrayBuffer, fetchError } = useFetchMp3ArrayBuffer(audioUrl);
  const { metadata } = useMetadata(arrayBuffer);
  const { coverArt } = useCoverArt(metadata);

  return {
    metadata,
    coverArt,
    fetchError,
  };
}
