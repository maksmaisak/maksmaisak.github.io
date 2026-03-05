import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleCard } from "./TitleCard";
import { Clip } from "./Clip";

/**
 * PERCEPTION MONTAGE
 * Combines perception system clips into a single montage with crossfades.
 *
 * Required raw clips in public/:
 *   perception_darkness.mp4   — Player moving between lit/dark areas, enemy reacts. ~8-12s.
 *   perception_projectile.mp4 — Projectile sensor detecting incoming grenades/projectiles. ~6-10s.
 *   perception_debugging.mp4  — Visual Logger / debug HUD showing perception data flowing. ~6-10s.
 *
 * Adjust durationInFrames per clip based on actual footage length.
 * At 30fps: 300 frames = 10s, 240 = 8s, 180 = 6s.
 */
const FADE = 15; // 0.5s crossfade at 30fps

export const PerceptionMontage: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title card */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <TitleCard title="Perception System" subtitle="Sight · Hearing · Custom Sensors" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 1: Darkness/Light stealth — the signature Metro mechanic */}
      <TransitionSeries.Sequence durationInFrames={300}>
        <Clip src="perception_darkness.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 2: Projectile sensor — grenades detected mid-air */}
      <TransitionSeries.Sequence durationInFrames={240}>
        <Clip src="perception_projectile.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 3: Debug/Visual Logger — perception data flowing through the system */}
      <TransitionSeries.Sequence durationInFrames={240}>
        <Clip src="perception_debugging.mp4" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
