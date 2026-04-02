import React from "react";
import { useVideoConfig } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Clip } from "./Clip";

export interface MontageClip {
  src: string;
  /** Start of the trim window in seconds (default: 0) */
  trimStart?: number;
  /** End of the trim window in seconds. Determines the sequence duration. */
  trimEnd: number;
  /** Instruction text shown in the Remotion preview when clip is missing */
  placeholder?: string;
}

/**
 * Renders a list of clips as a TransitionSeries with consistent spring-based fades.
 *
 * Duration is derived automatically from each clip's trimStart/trimEnd.
 * The last clip crossfades back into the first for seamless looping.
 */
export const MontageSequence: React.FC<{
  clips: MontageClip[];
  /** Fade duration in frames */
  fadeDuration?: number;
}> = ({ clips, fadeDuration = 20 }) => {
  const { fps } = useVideoConfig();
  const timingProps = {
    config: { damping: 200 },
    durationInFrames: fadeDuration,
  };

  return (
    <TransitionSeries>
      {clips.map((clip, i) => {
        const start = clip.trimStart ?? 0;
        const durationSeconds = clip.trimEnd - start;
        const durationInFrames = Math.round(durationSeconds * fps);

        return (
          <React.Fragment key={`${clip.src}-${i}`}>
            <TransitionSeries.Sequence durationInFrames={durationInFrames}>
              <Clip
                src={clip.src}
                trimStart={start}
                trimEnd={clip.trimEnd}
                placeholder={clip.placeholder}
              />
            </TransitionSeries.Sequence>
            {/* Transition after every clip including the last (loop fade) */}
            <TransitionSeries.Transition
              presentation={fade()}
              timing={springTiming(timingProps)}
            />
          </React.Fragment>
        );
      })}
      {/* Repeat first clip for seamless loop-back */}
      {clips.length > 0 && (() => {
        const first = clips[0];
        const start = first.trimStart ?? 0;
        const durationInFrames = Math.round((first.trimEnd - start) * fps);
        return (
          <TransitionSeries.Sequence durationInFrames={durationInFrames}>
            <Clip
              src={first.src}
              trimStart={start}
              trimEnd={first.trimEnd}
              placeholder={first.placeholder}
            />
          </TransitionSeries.Sequence>
        );
      })()}
    </TransitionSeries>
  );
};
