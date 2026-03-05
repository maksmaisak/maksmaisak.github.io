import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleCard } from "./TitleCard";
import { Clip } from "./Clip";

/**
 * COMBAT MONTAGE
 * Showcases all enemy types and their distinct combat behaviors.
 *
 * Required raw clips in public/:
 *   enemy_human_combat.mp4 — Human enemies using cover, popping out to shoot, repositioning. ~10-15s.
 *   enemy_nosalis.mp4      — Nosalis pack surrounding the player via combat circle, attacks. ~10-15s.
 *   enemy_lurker.mp4       — Lurkers hiding, bounce/drive-by attacks, scatter on kill. ~10-15s.
 *   enemy_hunter.mp4       — Hunters using hit-and-run, dodging, pair attacks. ~10-15s.
 *
 * Adjust durationInFrames per clip based on actual footage length.
 */
const FADE = 15;

export const CombatMontage: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title card */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <TitleCard title="Enemy AI" subtitle="Humans · Nosalises · Lurkers · Hunters" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 1: Human cover combat — the bread and butter */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="enemy_human_combat.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 2: Nosalis pack — surrounding, combat circle, group attacks */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="enemy_nosalis.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 3: Lurkers — ambush predators, hide-attack-retreat cycle */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="enemy_lurker.mp4" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      {/* Clip 4: Hunters — evasive guerrilla fighters */}
      <TransitionSeries.Sequence durationInFrames={360}>
        <Clip src="enemy_hunter.mp4" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
