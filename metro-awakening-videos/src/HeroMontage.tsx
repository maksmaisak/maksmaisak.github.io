import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleCard } from "./TitleCard";
import { Clip } from "./Clip";

/**
 * HERO MONTAGE
 * A highlight reel combining the most impressive moments from all sections.
 * Use this as a header video or demo reel link.
 *
 * Uses the SAME raw clips as the section montages — just shorter trims of each.
 * All clips should be in public/.
 *
 * Recommended clip order (high-energy → technical depth → back to action):
 *   1. enemy_nosalis.mp4       — Visceral pack combat (best 5s)
 *   2. perception_darkness.mp4 — Stealth light/dark moment (best 4s)
 *   3. cover_dynamic_safety.mp4 — Cover points updating live (best 4s)
 *   4. enemy_hunter.mp4        — Evasive ambush enemy (best 5s)
 *   5. enemy_human_combat.mp4  — Cover-based firefight (best 5s)
 *   6. stagger_hit_reactions.mp4 — Satisfying stagger hit (best 3s)
 *   7. rvo_avoidance.mp4       — Smooth crowd movement (best 3s)
 *
 * Adjust trimStart/trimEnd in each <Clip> to pick the best moments.
 * Total: ~30-35s at 30fps (900-1050 frames).
 */
const FADE = 12; // Slightly faster fades for a punchier reel

export const HeroMontage: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title card */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <TitleCard title="Metro Awakening" subtitle="AI Systems — Maks Maisak" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Nosalis pack combat — open with action */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <Clip src="enemy_nosalis.mp4" trimStart={0} trimEnd={5} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Darkness/light stealth */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Clip src="perception_darkness.mp4" trimStart={0} trimEnd={4} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Cover safety updating in real time */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Clip src="cover_dynamic_safety.mp4" trimStart={0} trimEnd={4} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Hunter ambush behavior */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <Clip src="enemy_hunter.mp4" trimStart={0} trimEnd={5} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Human cover combat */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <Clip src="enemy_human_combat.mp4" trimStart={0} trimEnd={5} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Hit reactions + stagger */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Clip src="stagger_hit_reactions.mp4" trimStart={0} trimEnd={3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* RVO avoidance — smooth technical finish */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Clip src="rvo_avoidance.mp4" trimStart={0} trimEnd={3} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
