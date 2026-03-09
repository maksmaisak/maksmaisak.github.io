import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleCard } from "./TitleCard";
import { Clip } from "./Clip";

/**
 * AI SYSTEMS MONTAGE
 * Combines runtime systems and polish-oriented clips.
 *
 * Required raw clips in public/:
 *   cover_dynamic_safety.mp4   — Cover points updating from safe to unsafe at runtime. ~10-15s.
 *   rvo_avoidance.mp4          — Multiple AIs navigating tight spaces without collision,
 *                                 showing RVO debug vis if possible. ~8-12s.
 *   stagger_hit_reactions.mp4  — Hit reactions (additive flinch) vs staggers (full-body interrupt),
 *                                 showing both light and heavy damage responses. ~8-12s.
 *
 * Adjust durationInFrames per clip based on actual footage length.
 */
const FADE = 15;

export const AISystemsMontage: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title card */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <TitleCard title="AI Systems" subtitle="Cover Safety · Avoidance · Damage Response" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 1: Cover safety updating at runtime */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="cover_dynamic_safety.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 2: RVO avoidance — smooth crowd navigation */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Clip src="rvo_avoidance.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 3: Hit reactions + staggers — light flinch vs full-body interrupt */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Clip src="stagger_hit_reactions.mp4" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
