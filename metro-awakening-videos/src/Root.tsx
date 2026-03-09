import "./index.css";
import { Composition, Folder } from "remotion";
import { Clip } from "./Clip";
import { HeroMontage } from "./HeroMontage";
import { PerceptionMontage } from "./PerceptionMontage";
import { CoverMontage } from "./CoverMontage";
import { CombatMontage } from "./CombatMontage";
import { AISystemsMontage } from "./AISystemsMontage";

const FPS = 30;
const WIDTH = 1280;
const HEIGHT = 720;

/**
 * All compositions for Metro Awakening portfolio videos.
 *
 * Workflow:
 * 1. Place raw clips in public/ (named as referenced in each composition's comments)
 * 2. Preview in Remotion Studio: npm run dev
 * 3. Render via batch scripts or: npx remotion render <composition-id> out/<name>.mp4
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Montages (multi-clip with transitions) ─────────────── */}
      <Folder name="Montages">
        <Composition
          id="HeroMontage"
          component={HeroMontage}
          durationInFrames={1050}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="PerceptionMontage"
          component={PerceptionMontage}
          durationInFrames={900}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="CoverMontage"
          component={CoverMontage}
          durationInFrames={450}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="CombatMontage"
          component={CombatMontage}
          durationInFrames={1620}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="AISystemsMontage"
          component={AISystemsMontage}
          durationInFrames={1200}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>

      {/* ── Individual clips (single video, for per-section media slots) ── */}
      <Folder name="Clips">
        {/* Perception */}
        <Composition
          id="perception-darkness"
          component={() => <Clip src="perception_darkness.mp4" />}
          durationInFrames={300}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="perception-projectile"
          component={() => <Clip src="perception_projectile.mp4" />}
          durationInFrames={240}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="perception-debugging"
          component={() => <Clip src="perception_debugging.mp4" />}
          durationInFrames={240}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        {/* Cover */}
        <Composition
          id="cover-dynamic-safety"
          component={() => <Clip src="cover_dynamic_safety.mp4" />}
          durationInFrames={360}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        {/* Enemy Types */}
        <Composition
          id="enemy-human-combat"
          component={() => <Clip src="enemy_human_combat.mp4" />}
          durationInFrames={360}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="enemy-nosalis"
          component={() => <Clip src="enemy_nosalis.mp4" />}
          durationInFrames={360}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="enemy-lurker"
          component={() => <Clip src="enemy_lurker.mp4" />}
          durationInFrames={360}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="enemy-hunter"
          component={() => <Clip src="enemy_hunter.mp4" />}
          durationInFrames={360}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        {/* Movement & Infrastructure */}
        <Composition
          id="rvo-avoidance"
          component={() => <Clip src="rvo_avoidance.mp4" />}
          durationInFrames={300}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
        <Composition
          id="stagger-hit-reactions"
          component={() => <Clip src="stagger_hit_reactions.mp4" />}
          durationInFrames={300}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      </Folder>
    </>
  );
};
