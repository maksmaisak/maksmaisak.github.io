import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleCard } from "./TitleCard";
import { Clip } from "./Clip";

/**
 * COVER SYSTEM MONTAGE
 * Shows cover generation, dynamic safety tracking, and EQS-driven cover selection.
 *
 * Required raw clips in public/:
 *   cover_dynamic_safety.mp4 — Cover points changing color as player moves (safe→unsafe). ~10-15s.
 *                               Show CoverTracker debug vis if possible.
 *
 * Optional additional clips (if you capture them):
 *   cover_eqs_query.mp4      — EQS debug view showing scored cover points during AI decision. ~8-10s.
 *   cover_repositioning.mp4  — Enemy leaving unsafe cover, running to new safe cover. ~8-10s.
 *
 * Adjust durationInFrames per clip based on actual footage length.
 */
const FADE = 15;

export const CoverMontage: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title card */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <TitleCard title="Cover System" subtitle="Generation · Safety Tracking · EQS Integration" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 1: Dynamic safety — cover points updating in real time */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="cover_dynamic_safety.mp4" />
      </TransitionSeries.Sequence>

      {/*
        Uncomment when you have additional clips:

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Clip src="cover_eqs_query.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Clip src="cover_repositioning.mp4" />
        </TransitionSeries.Sequence>
      */}
    </TransitionSeries>
  );
};
