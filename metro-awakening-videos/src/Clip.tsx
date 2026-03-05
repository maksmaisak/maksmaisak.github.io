import { Video } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";
import React from "react";

/**
 * Full-frame video clip that fills the composition.
 * Place raw footage in public/ and reference by filename.
 */
export const Clip: React.FC<{
  src: string;
  /** Trim start in seconds */
  trimStart?: number;
  /** Trim end in seconds */
  trimEnd?: number;
}> = ({ src, trimStart, trimEnd }) => {
  const { fps } = useVideoConfig();
  return (
    <Video
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
      volume={0}
      trimBefore={trimStart ? trimStart * fps : undefined}
      trimAfter={trimEnd ? trimEnd * fps : undefined}
    />
  );
};
